const Job = require("../models/JobApplication.js");

async function getJobs(req, res) {
    try {
        const jobs = await Job.find({user: req.user.id});
        return res.status(200).json(jobs);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

async function getJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({message:"Job not found"});
        return res.status(200).json(job);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}
async function createJob(req, res) {
    try {
        const job = await Job.create({...req.body, user: req.user.id})
        return res.status(201).json(job);
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
}
async function updateJob(req, res) {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!job) return res.status(404).json({message:"Job not found"});
        return res.status(200).json(job);
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
}
async function deleteJob(req, res) {
    try {
        const job = await Job.findByIdAndDelete(req.params.id)
        if (!job) return res.status(404).json({ message: "Job not found" })
        return res.status(200).json(`Job with id ${req.params.id} has been deleted`);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

module.exports = {getJobs, getJob, createJob, updateJob, deleteJob};