const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: String,
            required: [true, "Please add a company name"],
        },
        role: {
            type: String,
            required: [true, "Please add a role"],
        },
        status: {
            type: String,
            required: [true, "Please add a status"],
            enum: ["Applied", "Interviewing", "Offered", "Rejected"],
        },
        dateApplied: {
            type: Date,
            required: [true, "Please add a date applied"],
        },
        jobPostingURL: {
            type: String,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", JobSchema);
