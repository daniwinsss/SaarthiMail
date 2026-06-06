const replyPrompt = (emailText) => {

    return `
You will be given an email that was received by the user. Your task is to write the user's reply back to the sender.

IMPORTANT RULES:
1. Write FROM the user's perspective TO the sender. The reply must sound like a person responding, not a summary.
2. Do NOT echo, quote, or paraphrase sentences from the original email as your reply. (Bad example: replying "Congratulations on being shortlisted." to an invitation email.)
3. Do NOT summarise the email. Do NOT describe what the email is about. The reply is the user's response, not an analysis.
4. Length: 3 to 6 sentences (about 60 to 140 words). Short paragraphs are fine.
5. Start with a greeting (e.g. "Hi <Name>," or "Dear <Team>,").
6. End with a sign-off (e.g. "Best,", "Thanks,", "Kind regards,").
7. Acknowledge the email's purpose in the first sentence, then handle the key point: confirm attendance, accept/decline, ask a clarifying question, provide requested info, or state next steps.
8. Reference any concrete details from the email that matter (date, time, link, deadline, person, topic) — but only if the user would naturally mention them.
9. Do NOT invent facts, links, names, or times that are not present in the original email.
10. Do NOT include a subject line, "Subject:", or any meta-commentary.
11. Return ONLY the reply body, with no JSON, code fences, or quotes around it.

GOOD EXAMPLE (invitation email):
Original: "You are invited to our product launch on June 10 at 5 PM at the Bangalore office."
Good reply: "Hi Anika, thank you for the invitation to the product launch on June 10. I'd be glad to attend — please send the calendar invite when you have a moment. Looking forward to seeing the new release. Best, Alex"

BAD EXAMPLE (do NOT do this):
"Congratulations on being shortlisted."  <- this is just a phrase from the email, not a reply.

Now write the reply for the following email:
"""
${emailText}
"""
`;
};

module.exports = replyPrompt;
