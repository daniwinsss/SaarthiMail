const OpenAI = require("openai");

const client = new OpenAI({
  // Keep the server bootable without AI credentials; callers already handle
  // provider failures and can fall back to non-AI email data.
  apiKey: process.env.GROQ_API_KEY || "missing-groq-api-key",

  baseURL: "https://api.groq.com/openai/v1",
});

module.exports = client;
