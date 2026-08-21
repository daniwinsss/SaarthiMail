/**
 * Single source of truth for the session cookie's attributes.
 *
 * A browser only accepts a cookie-clearing response when the clearing cookie
 * carries the *same* attributes the cookie was set with. In production the
 * session cookie is cross-site (`sameSite: "none"`, `secure: true`), and Chrome
 * rejects any `SameSite=None` write that is not also `Secure` — so a
 * `res.clearCookie("connect.sid")` with no options silently fails and the user
 * stays logged in. app.js and the logout route both read from here so the two
 * can never drift apart again.
 */

const SESSION_COOKIE_NAME = "connect.sid";

const sessionCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        path: "/",
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    };
};

module.exports = { SESSION_COOKIE_NAME, sessionCookieOptions };
