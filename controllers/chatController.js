const { searchJobs } = require('../services/ragService');
const { llm } = require('../services/groqService');
const { buildPrompt } = require('../utils/promptTemplate');

module.exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const docs = await searchJobs(message);
    const context = docs.map((doc) => doc.pageContent).join('\n\n');
    const prompt = buildPrompt(context, message);
    const response = await llm.invoke(prompt);

    res.status(200).json({
      reply: response.content,
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({
      error: error.message || 'Chatbot failed',
    });
  }
};