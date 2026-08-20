const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
};

const blockDemoWrites = (req, res, next) => {
    if (req.user?.isDemo) {
        return res.status(403).json({
            success: false,
            message: "This is a read-only demo.",
        });
    }
    return next();
};

module.exports = { ensureAuthenticated, blockDemoWrites };
