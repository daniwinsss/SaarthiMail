const client = require("../../config/ai.js");
const replyPrompt = require("../../prompts/reply.prompt.js");

const generateReply = async(emailtext)=>{
    try{
        const prompt = replyPrompt(emailtext);
        const response = await client.chat.completions.create({
            model:"llama-3.1-8b-instant",
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 400,
            messages :[
                {
                    role: "system",
                    content: "You are an expert email assistant. You write concise, professional, ready-to-send email replies. You never summarise, never echo the sender, and never include subject lines or commentary. You only output the reply body."
                },
                {
                    role : "user",
                    content : prompt,
                }
            ]
        })
        const raw = response?.choices?.[0]?.message?.content || "";
        return cleanReply(raw);
    }
    catch(error){
        console.log(error);
        throw error;
    }
};

const cleanReply = (text) => {
    if (!text) return "";
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/```\s*$/, "");
    cleaned = cleaned.replace(/^"(.*)"$/s, "$1");
    cleaned = cleaned.replace(/^(subject\s*:\s*.*\n+)/i, "");
    return cleaned.trim();
};

module.exports = generateReply;