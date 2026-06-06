const client = require("../../config/ai.js");

const meetingPrompt =
require("../../prompts/meeting.prompt.js");

const extractMeeting = async (emailText) => {

    try {

        const prompt =
            meetingPrompt(emailText);

        const response =
            await client.chat.completions.create({
                model: "llama-3.1-8b-instant",

                messages: [
                    {
                        role: "user",

                        content: prompt,
                    }
                ]
            });

        const content =
            response.choices[0].message.content;

        return JSON.parse(content);

    } catch(error) {

        console.log(error);

        throw error;
    }
};

module.exports = extractMeeting;