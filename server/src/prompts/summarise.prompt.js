const summarizePrompt = (emailText) => {
    return `
You are an AI email assistant.

Analyze the email and return ONLY valid JSON.

Format:
{
  "summary": "...",
  "priority": "high/medium/low",
  "action": "...",
  "reply": "..."
}

Email:
${emailText}
`;
};

module.exports = summarizePrompt;