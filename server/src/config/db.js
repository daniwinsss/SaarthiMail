const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
    } catch (error) {
        // Exiting here keeps the process from reporting "Server running" while
        // it has no database, which turns every later query into a bare
        // unhandled rejection.
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;