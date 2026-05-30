import { embeddings } from "./embeddingService.js";
import { MemoryVectorStore }
from "langchain/vectorstores/memory";

let vectorStore;

export const initializeVectorStore = async (jobs) => {

  try {

    const documents = jobs.map((job) => ({

      pageContent: `
        Job Title: ${job.title}

        Company: ${job.company}

        Skills Required: ${job.skills}

        Experience Required: ${job.experience}

        Job Description:
        ${job.description}
      `,

      metadata: {
        id: job.id,
      },

    }));

    vectorStore =
      await MemoryVectorStore.fromDocuments(
        documents,
        embeddings
      );

    console.log("Vector store initialized");

  } catch (error) {

    console.error("Vector Store Error:", error);

  }
};

export const searchJobs = async (query) => {

  if (!vectorStore) {
    throw new Error("Vector store not initialized");
  }

  const results =
    await vectorStore.similaritySearch(query, 4);

  return results;
};