const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const extractGroqReply = (data) => {
  if (!data) return null;
  if (Array.isArray(data.choices) && data.choices.length > 0) {
    const choice = data.choices[0];
    if (choice.message && typeof choice.message.content === 'string') {
      return choice.message.content;
    }
    if (choice.message && Array.isArray(choice.message)) {
      return choice.message.map((m) => m.content).join('\n');
    }
  }
  if (typeof data.output_text === 'string') {
    return data.output_text;
  }
  if (Array.isArray(data.output) && data.output.length > 0) {
    return data.output.map((item) => item.content || '').join('\n');
  }
  return null;
};

module.exports.llm = {
  invoke: async (prompt) => {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GROQ request failed: ${response.status} ${response.statusText} - ${body}`);
    }

    const payload = await response.json();
    const content = extractGroqReply(payload);
    if (!content) {
      throw new Error(`GROQ response missing reply: ${JSON.stringify(payload)}`);
    }
    return { content };
  },
};
