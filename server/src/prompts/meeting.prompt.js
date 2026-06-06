const meetingPrompt = (emailText) => {

    return `
You are an AI meeting detection assistant.

Your task:
Analyze the email carefully.

Detect:
- meeting requests
- scheduling intent
- calls
- appointments
- discussions involving date/time

Return ONLY valid JSON.

Rules:
- hasMeeting must be true if any scheduling intent exists.
- Extract date if mentioned.
- Extract time if mentioned.
- If not found, use empty string.

Format:
{
  "hasMeeting": true,
  "date": "",
  "time": ""
}

Email:
${emailText}
`;
};

module.exports = meetingPrompt;