import { useState } from "react";
import api from "../api/axios";
import { useNavigate }
from "react-router-dom";
function Login() {

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await api.post(
                    "/token/",
                    {
                        username,
                        password
                    }
                );

           localStorage.setItem(
    "access",
    response.data.access
);

localStorage.setItem(
    "refresh",
    response.data.refresh
);

navigate("/home");
           

        } catch (err) {

            console.log(err);

            alert("Login Failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(
                        e.target.value
                    )
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(
                        e.target.value
                    )
                }
            />

            <button>
                Login
            </button>

        </form>
    );
}

export default Login;