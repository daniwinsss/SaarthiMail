const isDemoLoginEnabled = () =>
    process.env.ENABLE_DEMO_LOGIN === "true" && !!process.env.DEMO_USER_EMAIL;

const buildDemoUser = () => ({
    googleId: "demo-user",
    name: "Demo User",
    email: process.env.DEMO_USER_EMAIL,
    picture: null,
    accessToken: null,
    refreshToken: null,
    isDemo: true,
});

module.exports = { buildDemoUser, isDemoLoginEnabled };
