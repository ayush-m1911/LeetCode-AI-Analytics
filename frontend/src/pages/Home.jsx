import { Link } from "react-router-dom";

function Home() {

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                marginTop: "100px"
            }}
        >

            <h1>
                LeetCode Analytics AI
            </h1>

            <Link to="/dashboard">
                <button>
                    Dashboard
                </button>
            </Link>

            <Link to="/analytics">
                <button>
                    Analytics
                </button>
            </Link>

            <Link to="/roadmap">
                <button>
                    AI Roadmap
                </button>
            </Link>

        </div>
    );
}

export default Home;