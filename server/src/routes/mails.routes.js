const express = require("express");
const router = express.Router();
const { fetchEmails, createDummyEmail, getSingleEmail,deleteEmail, updateEmail,getPriorityEmails,generateAIReply,detectMeeting,createMeetingEvent} = require("../controllers/mail.controller.js");
router.post("/", createDummyEmail);
router.get("/", fetchEmails);
router.get(
    "/priority",
    getPriorityEmails
);
router.post(
    "/reply",
    generateAIReply
);
router.post(
    "/meeting",
    detectMeeting
);
router.post(
    "/calendar/create",
    createMeetingEvent
);
router.get("/:id", getSingleEmail);
router.delete("/:id",deleteEmail);
router.put("/:id",updateEmail)
module.exports = router;