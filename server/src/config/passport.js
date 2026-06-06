const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
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