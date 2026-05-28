import {useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const {data} = await axios.post("http://localhost:5000/api/auth/register", {name, email, password})
            localStorage.setItem("token", data.accessToken)
            navigate("/dashboard");
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    )
}

export default Register;