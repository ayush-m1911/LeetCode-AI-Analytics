import {
    BrowserRouter,
    Routes,
    Route
}
from "react-router-dom";

import Login
from "./pages/Login";

import Dashboard
from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Roadmap from "./pages/Roadmap";
import Home
from "./pages/Home";
function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />
                <Route
    path="/roadmap"
    element={<Roadmap />}
/>
                <Route
    path="/home"
    element={<Home />}
/>
            </Routes>

        </BrowserRouter>
    );
}

export default App;