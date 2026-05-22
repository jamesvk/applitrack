const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db.js");
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Cors middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/", (req, res) => {
    res.json({message: "Welcome to Job Tracker"});
})

app.listen(port, () => {console.log(`Server listening on port ${port}`)})