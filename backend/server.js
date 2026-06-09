require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");

const port = process.env.PORT || 5000;
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cors middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
