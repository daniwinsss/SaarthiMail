const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

if (process.env.NODE_ENV === "production" && !process.env.GOOGLE_CALLBACK_URL) {
    throw new Error("GOOGLE_CALLBACK_URL env var is required in production");
}

const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`;

passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
    },
        async (accessToken, refreshToken, profile, done) => {
            const user = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
                accessToken,
                refreshToken,
            };
            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});