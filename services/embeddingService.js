const { HuggingFaceTransformersEmbeddings } = require('@langchain/community/embeddings/hf_transformers');

module.exports.embeddings = new HuggingFaceTransformersEmbeddings({
  model: 'Xenova/all-MiniLM-L6-v2',
});
