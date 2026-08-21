const express = require("express");
const router = express.Router();
const { fetchEmails, createDummyEmail, getSingleEmail,deleteEmail, updateEmail,getPriorityEmails,generateAIReply,detectMeeting,createMeetingEvent,getCalendarEvents} = require("../controllers/mail.controller.js");
const { blockDemoWrites } = require("../middlewares/auth.middleware.js");

router.post("/", blockDemoWrites, createDummyEmail);
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
    blockDemoWrites,
    createMeetingEvent
);
// Must stay above "/:id" or the wildcard swallows it.
router.get(
    "/calendar/events",
    getCalendarEvents
);
router.get("/:id", getSingleEmail);
router.delete("/:id", blockDemoWrites, deleteEmail);
router.put("/:id", blockDemoWrites, updateEmail)
module.exports = router;