import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import axios from "axios";

function Dashboard() {
    const {user, token, logout} = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const {data} = await axios.get("http://localhost:5000/api/jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(data);
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
            <ul>
                {jobs.map(job => {
                    return <li key={job._id}>{job.company} - {job.role} - {job.status}</li>
                })}
            </ul>
        </>
    )
}

export default Dashboard;