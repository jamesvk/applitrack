const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");


const port = process.env.PORT || 5000;
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Cors middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Job Tracker"});
})


const startServer = async() => {
    await connectDB();
    app.listen(port, () => {console.log(`Server listening on port ${port}`)})
}

startServer();