const { embeddings } = require('./embeddingService');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');

let vectorStore;

const loadJobsFromDb = async () => {
  const { db } = require('../server');
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM jobs', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const buildDocuments = (jobs) =>
  jobs.map((job) => ({
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

module.exports.initializeVectorStore = async (jobs) => {
  try {
    const documents = buildDocuments(jobs);
    vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    console.log('Vector store initialized with', documents.length, 'documents');
  } catch (error) {
    console.error('Vector Store Error:', error);
  }
};

module.exports.searchJobs = async (query) => {
  if (!vectorStore) {
    const jobs = await loadJobsFromDb();
    await module.exports.initializeVectorStore(jobs);
  }

  if (!vectorStore) {
    throw new Error('Vector store not initialized');
  }

  const results = await vectorStore.similaritySearch(query, 4);
  return results;
};
