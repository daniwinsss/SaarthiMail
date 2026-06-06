const client = require('../../config/ai.js');
const summarizePrompt = require("../../prompts/summarise.prompt.js");

const parseSummary = (content) => {
    if (!content || typeof content !== "string") {
        throw new Error("Empty AI response");
    }

    try {
        return JSON.parse(content);
    } catch (err) {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        throw err;
    }
};

const summarizeEmail = async (emailText) => {
    try {
        const prompt = summarizePrompt(emailText);
        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ]
        });

        const content = response?.choices?.[0]?.message?.content;
        const parsed = parseSummary(content);

        return {
            summary: parsed?.summary || "",
            priority: parsed?.priority || "low",
            action: parsed?.action || "",
            reply: parsed?.reply || "",
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = {
    summarizeEmail,
};
