import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";
import JobForm from "../components/JobForm.jsx";

function Dashboard() {
    const { token, logout } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filter, setFilter] = useState("All");
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const statusCounts = {
        All: jobs.length,
        Applied: jobs.filter((j) => j.status === "Applied").length,
        Interviewing: jobs.filter((j) => j.status === "Interviewing").length,
        Offered: jobs.filter((j) => j.status === "Offered").length,
        Rejected: jobs.filter((j) => j.status === "Rejected").length,
    };

    const filteredJobs =
        filter === "All" ? jobs : jobs.filter((j) => j.status === filter);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/jobs`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setJobs(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    logout();
                }
                setFetchError(
                    error.response?.data?.message ||
                        "Failed to load jobs. Please try again"
                );
            } finally {
                setFetching(false);
            }
        };
        fetchJobs();
    }, []);

    const handleDelete = async (job) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );
        if (!confirmed) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/jobs/${job._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setJobs((prev) => prev.filter((j) => j._id !== job._id));
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to delete job. Please try again."
            );
        }
    };

    // status badge colors
    const statusColors = {
        Applied: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        Interviewing:
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        Offered: "bg-green-500/20 text-green-400 border border-green-500/30",
        Rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Navbar */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="px-6 py-4 flex items-center justify-between md:max-w-4xl md:mx-auto">
                    {/* Left — AppliTrack + name on desktop */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Appli<span className="text-indigo-500">Track</span>
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Job Form */}
                {showForm && (
                    <div className="mb-6">
                        <JobForm
                            key={selectedJob?._id || "new"}
                            setJobs={setJobs}
                            setShowForm={setShowForm}
                            job={selectedJob}
                        />
                    </div>
                )}

                {/* Title row — My Applications + Add Job (mobile only) */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-none">
                        My Applications
                    </h2>
                    <button
                        onClick={() => {
                            setSelectedJob(null);
                            setShowForm(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-lg font-medium transition-colors border border-indigo-500 shrink-0 md:opacity-0 md:pointer-events-none"
                    >
                        + Add Job
                    </button>
                </div>

                {/* Filters + Add Job (desktop) / Filters only (mobile) */}
                <div className="flex flex-wrap items-center justify-between mb-0 md:mb-6 gap-2">
                    <div className="flex flex-wrap gap-x-2 gap-y-0 md:gap-y-2">
                        {[
                            "All",
                            "Applied",
                            "Interviewing",
                            "Offered",
                            "Rejected",
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                    filter === status
                                        ? "bg-indigo-600 border-indigo-500 text-white"
                                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                                }`}
                            >
                                {status} ({statusCounts[status]})
                            </button>
                        ))}
                    </div>

                    {/* Add Job — desktop only, same style as filter buttons */}
                    <button
                        onClick={() => {
                            setSelectedJob(null);
                            setShowForm(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-500 shrink-0 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
                    >
                        + Add Job
                    </button>
                </div>

                {/* Job list */}
                {fetching ? (
                    <p className="text-slate-400 text-center py-12">
                        Loading...
                    </p>
                ) : fetchError ? (
                    <p className="text-red-400 text-center py-12">
                        {fetchError}
                    </p>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-400 text-lg">
                            No applications found.
                        </p>
                        <p className="text-slate-600 text-sm mt-1">
                            Add your first application to get started.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 -mt-2 md:mt-0">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 hover:border-slate-700 transition-colors"
                            >
                                {/* Top row — company + status */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-white font-semibold">
                                        {job.company}
                                    </h3>
                                    <div className="w-32 flex justify-end">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[job.status]}`}
                                        >
                                            {job.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom row — role + date + buttons */}
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-400 text-sm">
                                        {job.role}
                                        {job.dateApplied && (
                                            <span className="text-slate-600 mx-2">
                                                ·
                                            </span>
                                        )}
                                        {job.dateApplied && (
                                            <span className="text-slate-500 text-xs">
                                                {new Date(
                                                    job.dateApplied
                                                ).toLocaleDateString("en-US", {
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        )}
                                    </p>
                                    <div className="w-32 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedJob(job);
                                                setShowForm(true);
                                            }}
                                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job)}
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-500/20"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Notes section — only if notes exist */}
                                {job.notes && (
                                    <div className="mt-3 pt-3 border-t border-slate-800">
                                        <p className="text-slate-500 text-xs">
                                            {job.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
