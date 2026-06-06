const Email = require("../models/email.models.js");
const generateReply = require("../services/ai/generateReply.js");
const extractMeeting =
    require("../services/ai/extractMeeting.js");
const createCalendarEvent = require("../services/google/createCalenderEvent.js");
const createMeetingEvent = async(req,res)=>{
    try {
        const accessToken = req.user?.accessToken || req.body?.accessToken;
        const emailText = req.body?.emailText || "";
        const meetingData = req.body?.meetingData || {};
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result =
            await createCalendarEvent(
                accessToken,
                meetingData,
                emailText
            );

        res.status(200).json({
            success: true,
            data: result,
        });

    } catch(error) {
        const status = error?.code || error?.response?.status || 500;
        const message =
            error?.response?.data?.error?.message ||
            error?.message ||
            "Error while creating calendar event";
        res.status(status).json({
            success: false,
            message,
            error: error?.response?.data?.error?.status || error?.code || status,
        });
    }
}
const getOwnerEmail = (req) => req.user?.email || null;
const detectMeeting = async (req, res) => {
    try {
        const { emailText } = req.body;
        const result = await extractMeeting(emailText)
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while detecting meeting",
            error: error.message,
        });
    }
}
const generateAIReply = async (req, res) => {

    try {

        const { emailText, mailId } = req.body;

        const reply =
            await generateReply(emailText);

        if (mailId) {
            try {
                const ownerEmail = getOwnerEmail(req);
                if (ownerEmail) {
                    await Email.findOneAndUpdate(
                        { _id: mailId, ownerEmail },
                        { reply }
                    );
                }
            } catch (saveErr) {
                console.log("Failed to persist generated reply:", saveErr.message);
            }
        }

        res.status(200).json({
            success: true,
            reply,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getPriorityEmails = async (req, res) => {

    try {
        const ownerEmail = getOwnerEmail(req);
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const emails = await Email.find({
            priority: "high",
            ownerEmail,
        });

        res.status(200).json({
            success: true,
            data: emails,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const fetchEmails = async (req, res) => {
    try {
        const ownerEmail = getOwnerEmail(req);
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const emails = await Email.find({ ownerEmail });
        res.status(200).json({
            message: "Emails fetched successfully",
            data: emails,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while fetching emails",
            error: error.message,
        })
    }
};
const createDummyEmail = async (req, res) => {
    try {
        const ownerEmail = getOwnerEmail(req);
        const createdEmail = await Email.create({
            ...req.body,
            ownerEmail: req.body.ownerEmail || ownerEmail,
        });
        res.status(201).json({
            message: "Email created successfully",
            data: createdEmail,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while creating email",
            error: error.message,
        })
    }
}
const getSingleEmail = async (req, res) => {
    try {
        const ownerEmail = getOwnerEmail(req);
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const email = await Email.findOne({
            _id: req.params.id,
            ownerEmail,
        });
        res.status(200).json({
            message: "Email fetched successfully",
            data: email,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while fetching email",
            error: error.message,
        })
    }
}
const deleteEmail = async (req, res) => {
    try {
        const ownerEmail = getOwnerEmail(req);
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const email = await Email.findOneAndDelete({
            _id: req.params.id,
            ownerEmail,
        });
        res.status(200).json({
            message: "Email deleted successfully",
            data: email,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while deleting email",
            error: error.message,
        })
    }
}
const updateEmail = async (req, res) => {
    try {
        const ownerEmail = getOwnerEmail(req);
        if (!ownerEmail) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const email = await Email.findOneAndUpdate(
            {
                _id: req.params.id,
                ownerEmail,
            },
            req.body
        );
        res.status(200).json({
            message: "Email updated successfully",
            data: email,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while updating email",
            error: error.message,
        })
    }
}
module.exports = { fetchEmails, createDummyEmail, getSingleEmail, deleteEmail, updateEmail, getPriorityEmails, generateAIReply, detectMeeting,createMeetingEvent };
