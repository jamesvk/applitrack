const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware.js");
const { getJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobController")

router.get("/", protect, getJobs)
router.get("/:id", protect, getJob)
router.post("/", protect, createJob)
router.put("/:id", protect, updateJob)
router.delete("/:id", protect, deleteJob)

module.exports = router;