const express = require("express");
const passport = require("passport");
const router = express.Router();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

router.get(
    "/google",
    passport.authenticate("google",{
        accessType: "offline",
        prompt: "consent",
        scope:[
            "profile",
            "email",
            "https://www.googleapis.com/auth/gmail.readonly",
           "https://www.googleapis.com/auth/calendar",
        ]
    })
);
router.get(
    "/google/callback",
    passport.authenticate("google",{
        failureRedirect: `${clientUrl}/auth`,
    }),
    (req, res) => {
        res.redirect(`${clientUrl}/`);
    }
);

router.get("/status", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error logging out" });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Logged out successfully" });
    });
});

module.exports = router;
