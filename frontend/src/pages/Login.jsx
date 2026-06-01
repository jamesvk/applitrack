import {useState, useContext} from "react"
import axios from "axios"
import { AuthContext } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {login} = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post("http://localhost:5000/api/auth/login", {email, password})
            login(data)
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
        </form>
    )
}

export default Login;