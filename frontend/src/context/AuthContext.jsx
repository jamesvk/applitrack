import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const navigate = useNavigate();

    const login = (data) => {
        setUser({_id: data._id, name: data.name, email: data.email});
        setToken(data.accessToken);
        localStorage.setItem("user", JSON.stringify({_id: data._id, name: data.name, email: data.email}))
        localStorage.setItem("token", data.accessToken)
        navigate("/dashboard")
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user")
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext}
export default AuthProvider