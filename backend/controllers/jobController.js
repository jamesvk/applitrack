const Job = require("../models/JobApplication.js");

async function getJobs(req, res) {
    try {
        const jobs = await Job.find({ user: req.user.id });
        return res.status(200).json(jobs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        return res.status(200).json(job);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
async function createJob(req, res) {
    try {
        const { company, role, status } = req.body;

        if (!company || !role || !status) {
            return res
                .status(400)
                .json({ message: "Please fill in all required fields" });
        }

        const job = await Job.create({ ...req.body, user: req.user.id });
        return res.status(201).json(job);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
async function updateJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        return res.status(200).json(updatedJob);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
async function deleteJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await Job.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
