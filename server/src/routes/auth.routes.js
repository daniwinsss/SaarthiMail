const express = require("express");
const passport = require("passport");
const router = express.Router();
const { buildDemoUser, isDemoLoginEnabled } = require("../config/demoUser.js");
const { SESSION_COOKIE_NAME, sessionCookieOptions } = require("../config/sessionCookie.js");

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

router.post("/demo", (req, res) => {
    if (!isDemoLoginEnabled()) {
        return res.status(404).json({
            success: false,
            message: "Demo login is not enabled",
        });
    }
    req.login(buildDemoUser(), (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Could not start demo session" });
        }
        res.json({ success: true, message: "Demo session started" });
    });
});

router.get("/status", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Logging out is a state change, so it is a POST. `req.logout` only detaches
// the user from the session -- the session document survives in the Mongo store
// until its 14-day TTL, so destroy it explicitly, then clear the cookie using
// the same attributes it was set with (see config/sessionCookie.js).
const handleLogout = (req, res) => {
    const finish = () => {
        res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions());
        res.json({ success: true, message: "Logged out successfully" });
    };

    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error logging out" });
        }

        if (!req.session) return finish();

        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                console.log("Failed to destroy session:", destroyErr.message);
            }
            // Clear the cookie regardless: an orphaned store record is
            // recoverable, a browser that stays authenticated is not.
            finish();
        });
    });
};

router.post("/logout", handleLogout);
// Retained so links and any already-deployed client build keep working.
router.get("/logout", handleLogout);

module.exports = router;
