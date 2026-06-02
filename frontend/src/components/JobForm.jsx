import {useState, useContext} from "react"
import {AuthContext} from "../context/AuthContext.jsx";
import axios from "axios"


function JobForm({setJobs, setShowForm, job}) {
    const [company, setCompany] = useState(job?.company || "");
    const [role, setRole] = useState(job?.role || "");
    const [status, setStatus] = useState(job?.status || "");
    const [date, setDate] = useState(job?.dateApplied?.split("T")[0] || "");
    const [url, setURL] = useState(job?.jobPostingURL || "");
    const [notes, setNotes] = useState(job?.notes || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {token} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (job) {
                const {data} = await axios.put(
                    `http://localhost:5000/api/jobs/${job._id}`,
                    { company, role, status, dateApplied: date, jobPostingURL: url, notes },
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                setJobs(prev => prev.map(job => job._id === data._id ? data : job));
            } else {
                const {data} = await axios.post(
                    "http://localhost:5000/api/jobs",
                    {company, role, status, dateApplied: date, jobPostingURL: url, notes},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setJobs(prev => [...prev, data]);
            }

            setShowForm(false);
        } catch(error) {
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Enter role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
            />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
            >
                <option value="">Select Status</option>
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
            />
            <input
                type="text"
                placeholder="Enter job url"
                value={url}
                onChange={(e) => setURL(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Enter notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
            />
            {error && <p style={{color:"red"}}>{error}</p>}
            <button type="submit" disabled={loading}>{loading ? "Saving..." : job ? "Save Changes" : "Add Job"}</button>
        </form>
    )
}

export default JobForm;