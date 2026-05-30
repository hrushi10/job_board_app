# Chatbot Architecture Overview

This document explains how the chat bot works in the `job-board` project from the frontend to the backend, including how requests flow, how the vector store is built, and how the response is generated.

## 1. Frontend chat user flow

### Key files
- `auth-frontend/src/Services/chatApi.js`
- `auth-frontend/src/services/Components/chatbot/ChatWidget.jsx`
- `auth-frontend/src/services/Components/chatbot/ChatInput.jsx`
- `auth-frontend/src/services/Components/chatbot/ChatMessages.jsx` (renders messages)

### What happens in the browser
1. The user types a question into `ChatInput.jsx`.
2. When the user clicks **Send**, `ChatInput` calls `onSend(message)`.
3. `ChatWidget.jsx` receives that message in its `handleSend()` callback.
4. `ChatWidget` immediately adds the user message to its local `messages` state.
5. Then it calls `sendMessageToBot(message)` from `auth-frontend/src/Services/chatApi.js`.

### API client
- `chatApi.js` defines the HTTP client function:
  - `API = "http://localhost:5000/api/chat"`
  - It sends the user message with `axios.post(API, { message })`
- This is the point where the frontend hands the user query off to the backend.

## 2. Backend routing and controller

### Key files
- `server.js`
- `Routes/chatRoutes.js`
- `controllers/chatController.js`

### Routing
- `server.js` mounts the chat route with:
  - `app.use('/api/chat', chatRoutes)`
- `Routes/chatRoutes.js` maps the POST request to the controller:
  - `router.post('/', chatWithBot)`

### Controller logic
- `controllers/chatController.js` receives the request body and validates the message.
- It then calls `searchJobs(message)` to retrieve relevant job context.
- After search results are returned, it builds a prompt and calls the LLM service.
- Finally, it responds with JSON:
  - `{ reply: response.content }`

## 3. Vector search and retrieval

### Key files
- `services/ragService.js`
- `services/embeddingService.js`
- `utils/promptTemplate.js`

### How the vector store is built
- `services/ragService.js` owns the in-memory `vectorStore`.
- It uses `MemoryVectorStore.fromDocuments(documents, embeddings)`.
- Documents are created from job rows in the database.
- Each document includes:
  - `pageContent`: job title, company, skills, experience, description
  - `metadata.id`: the job ID

### Lazy initialization
- If `searchJobs()` is called before `vectorStore` exists, it loads jobs from the database and initializes it.
- This means the first chat request can build the vector store automatically.

### Embeddings
- `services/embeddingService.js` exports an embeddings instance:
  - `HuggingFaceTransformersEmbeddings` with model `Xenova/all-MiniLM-L6-v2`
- These embeddings turn each job document into vectors for similarity search.

### Searching
- `searchJobs(query)` calls `vectorStore.similaritySearch(query, 4)`.
- This returns the top 4 job documents most relevant to the user query.
- The backend then joins those documents into a single `context` string.

## 4. Prompt building

### Key file
- `utils/promptTemplate.js`

### Prompt contents
- `buildPrompt(context, question)` creates the prompt sent to the LLM.
- It includes:
  - A role description: "AI Career Assistant for a Job Board application"
  - A requirement to only answer using provided job context
  - Instructions to say "I could not find matching jobs in the database." if no answer exists
  - The joined job context
  - The original user question
- This makes the model answer in a focused way based on retrieved jobs.

## 5. LLM / Groq integration

### Key file
- `services/groqService.js`

### Current setup
- The backend uses a custom Groq OpenAI-compatible HTTP call.
- It posts to:
  - `https://api.groq.com/openai/v1/chat/completions`
- It sends:
  - `model` from `process.env.GROQ_MODEL` or fallback `llama-3.1-8b-instant`
  - `temperature: 0.3`
  - one message with `role: 'user'` and `content: prompt`
- It expects the response to contain a `choices` array with a message body.

### Environment
- The request uses `Authorization: Bearer ${process.env.GROQ_API_KEY}`
- That means the backend must have `GROQ_API_KEY` set in its environment (e.g. `.env`).

## 6. Response flow back to the frontend

1. The LLM call returns a response payload.
2. `groqService.js` extracts the reply text and returns `{ content }`.
3. `chatController.js` sends:
   - `{ reply: response.content }`
4. `auth-frontend/src/Services/chatApi.js` receives the backend payload.
5. `ChatWidget.jsx` takes `data.reply` and appends a bot message:
   - `{ sender: 'bot', text: data.reply }`
6. The chat widget now shows the bot’s answer in the chat history.

## 7. How the pieces are connected

- Frontend message input → `ChatInput` → `ChatWidget.handleSend`
- `ChatWidget` → frontend API client `sendMessageToBot`
- API client → POST to `http://localhost:5000/api/chat`
- Express route → `Routes/chatRoutes.js`
- Controller → `chatController.chatWithBot`
- Search service → `services/ragService.searchJobs`
- Embeddings → `services/embeddingService.js`
- Prompt creation → `utils/promptTemplate.js`
- LLM call → `services/groqService.llm.invoke`
- Response → `reply` JSON → frontend message state

## 8. Important behavior notes

- The backend preloads the vector store on DB connect via `initializeVectorStore(results)`.
- If the vector store is missing, `searchJobs()` will load jobs from MySQL and recreate it.
- The frontend expects a response shape of `{ reply: string }`.
- Errors in the backend are logged, and the frontend currently only prints them to the console.

## 9. Troubleshooting pointers

- If frontend shows `404` for `/api/chat`, check the backend is running on port `5000` and that `server.js` is up.
- If the chat reply is missing or invalid, check the Groq API request path and `GROQ_API_KEY`.
- If `vector store not initialized` appears, ensure the backend can read from MySQL and the `jobs` table has rows.
- If the bot returns unrelated answers, inspect the prompt and the retrieved `context` text.

## 10. Summary

The chat bot is a classic RAG-style pipeline:
- user message → frontend API → backend search + prompt construction → LLM call → bot reply
- The chat UI is lightweight: it just manages state, renders messages, and calls the API.
- The backend does the heavy lifting: data retrieval, embedding-based similarity search, prompt assembly, and model invocation.

This makes it easy to update any piece independently:
- swap the LLM integration in `groqService.js`
- improve retrieval in `ragService.js`
- refine prompt rules in `promptTemplate.js`
- change frontend rendering in `ChatWidget.jsx`
