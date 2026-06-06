const fetchEmails = require("../services/gmail/fetchEmails.js");
const getEmailDetails = require("../services/gmail/fetchEmailDetails.js");
const { summarizeEmail } = require("../services/ai/summarizeEmail.js");
const Email = require("../models/email.models.js");

const decodeBase64Url = (data = "") => {
    const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf-8");
};

const normalizeMessageBody = (body) => {
    if (!body) return "";

    const decodeHtmlEntities = (value) =>
        value
            .replace(/&nbsp;/gi, " ")
            .replace(/&zwj;/gi, "")
            .replace(/&zwnj;/gi, "")
            .replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
            .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
                String.fromCharCode(Number.parseInt(code, 16))
            );

    return decodeHtmlEntities(body)
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<\/?[^>]+>/g, " ")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

const getBodyFromPayload = (payload) => {
    if (!payload) return "";

    if (payload.body?.data) {
        return payload.body.data;
    }

    if (!Array.isArray(payload.parts)) {
        return "";
    }

    const findBodyByMimeType = (mimeType) => {
        for (const part of payload.parts) {
            if (part.mimeType === mimeType && part.body?.data) {
                return part.body.data;
            }
        }
        return "";
    };

    const plainText = findBodyByMimeType("text/plain");
    if (plainText) return plainText;

    const htmlText = findBodyByMimeType("text/html");
    if (htmlText) return htmlText;

    for (const part of payload.parts) {
        const nestedBody = getBodyFromPayload(part);
        if (nestedBody) return nestedBody;
    }

    return "";
};

const parseGmailEmail = (emailData) => {
    const headers = emailData.payload?.headers || [];
    const getHeader = (name) =>
        headers.find((header) => header.name.toLowerCase() === name.toLowerCase())
            ?.value || "";

    const rawFrom = getHeader("from");
    const subject = getHeader("subject");
    const date = getHeader("date");

    let sender = rawFrom;
    let senderEmail = rawFrom;
    const match = rawFrom.match(/(.*)<(.*)>/);
    if (match) {
        sender = match[1].trim() || match[2].trim();
        senderEmail = match[2].trim();
    } else if (rawFrom) {
        sender = rawFrom.split("@")[0];
    }

    const snippet = emailData.snippet || "";
    const rawBody = getBodyFromPayload(emailData.payload);
    const body = normalizeMessageBody(rawBody ? decodeBase64Url(rawBody) : "");

    return {
        gmailId: emailData.id,
        threadId: emailData.threadId,
        snippet,
        body,
        sender,
        senderEmail,
        subject,
        date: date ? new Date(date) : new Date(),
    };
};

const getGmailEmails = async (req, res) => {
    try {
        const accessToken = req.user.accessToken;
        const ownerEmail = req.user.email;
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const messages = await fetchEmails(accessToken);
        const detailEmails = await Promise.all(
            messages.map(async (message) => {
                const emailData = await getEmailDetails(
                    accessToken,
                    message.id
                );
                const parsedEmail = parseGmailEmail(emailData);

                const aiSummary = await summarizeEmail(parsedEmail.snippet);
                await Email.findOneAndUpdate(
                    {
                        gmailId: parsedEmail.gmailId,
                    },

                    {
                        ...parsedEmail,
                        ownerEmail,
                        summary: aiSummary.summary,
                        priority: aiSummary.priority,
                        action: aiSummary.action,
                        reply: aiSummary.reply,
                    },

                    {
                        upsert: true,

                        new: true,
                    }
                );
                return {
                    id: parsedEmail.gmailId,
                    threadId: parsedEmail.threadId,
                    snippet: parsedEmail.snippet,
                    ai: aiSummary,
                };
            })
        );
        res.status(200).json({
            success: true,
            data: detailEmails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getGmailMessage = async (req, res) => {
    try {
        const accessToken = req.user.accessToken;
        const ownerEmail = req.user.email;
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { messageId } = req.params;
        const emailData = await getEmailDetails(accessToken, messageId);
        const parsedEmail = parseGmailEmail(emailData);

        res.status(200).json({
            success: true,
            data: parsedEmail,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getGmailEmails,
    getGmailMessage,

};
