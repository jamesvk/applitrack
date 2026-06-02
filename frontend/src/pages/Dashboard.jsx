import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import axios from "axios";
import JobForm from "../components/JobForm.jsx";

function Dashboard() {
    const {user, token, logout} = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);


    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const {data} = await axios.get("http://localhost:5000/api/jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setJobs(data);
            } catch(error) {
                console.log(error.response?.data?.message || "Something went wrong");
            }
        }
        fetchJobs();
    }, [])

    return (
        <>
            <div>
                <h1>{user?.name}</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <div>
                <button onClick={() => {
                    setSelectedJob(null)
                    setShowForm(true)
                }}>Add Job</button>
            </div>
            {showForm && <JobForm setJobs={setJobs} setShowForm={setShowForm} job={selectedJob}/>}
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                        {job.company} - {job.role} - {job.status}
                        <button onClick={() => {
                            setSelectedJob(job);
                            setShowForm(true);
                        }}>Edit</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Dashboard;