import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";

function JobForm({ setJobs, setShowForm, job }) {
    const [company, setCompany] = useState(job?.company || "");
    const [role, setRole] = useState(job?.role || "");
    const [status, setStatus] = useState(job?.status || "");
    const [date, setDate] = useState(job?.dateApplied?.split("T")[0] || "");
    const [url, setURL] = useState(job?.jobPostingURL || "");
    const [notes, setNotes] = useState(job?.notes || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { token } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (job) {
                const { data } = await axios.put(
                    `http://localhost:5000/api/jobs/${job._id}`,
                    {
                        company,
                        role,
                        status,
                        dateApplied: date,
                        jobPostingURL: url,
                        notes,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setJobs((prev) =>
                    prev.map((j) => (j._id === data._id ? data : j))
                );
            } else {
                const { data } = await axios.post(
                    "http://localhost:5000/api/jobs",
                    {
                        company,
                        role,
                        status,
                        dateApplied: date,
                        jobPostingURL: url,
                        notes,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setJobs((prev) => [...prev, data]);
            }

            setShowForm(false);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">
                    {job ? "Edit Application" : "New Application"}
                </h3>
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-white transition-colors text-xl font-light"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Two column grid on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        className={inputClass}
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className={inputClass}
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="" disabled>
                            Select Status
                        </option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className={`${inputClass} cursor-pointer`}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Job posting URL"
                    value={url}
                    onChange={(e) => setURL(e.target.value)}
                    className={inputClass}
                />
                <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-3 rounded-lg font-medium transition-colors border border-slate-700 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors text-sm"
                    >
                        {loading
                            ? "Saving..."
                            : job
                              ? "Save Changes"
                              : "Add Job"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JobForm;
