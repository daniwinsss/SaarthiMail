const express = require("express");
const router = express.Router();
const {
    getGmailEmails,
    getGmailMessage,
} = require("../controllers/gmail.controller.js");

router.get("/message/:messageId", getGmailMessage);
router.get("/", getGmailEmails);
module.exports = router;
