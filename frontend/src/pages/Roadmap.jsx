import { useState } from "react";
import api from "../api/axios";

function Roadmap() {

    const [goal, setGoal] =
        useState("");

    const [roadmap,
        setRoadmap]
        = useState(null);

    const [loading,
        setLoading]
        = useState(false);

    const generateRoadmap =
        async () => {

            try {

                setLoading(true);

                const response =
                    await api.post(
                        "/roadmap/generate/",
                        {
                            goal
                        }
                    );

                setRoadmap(
                    response.data.roadmap
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>
                AI Roadmap Generator
            </h1>

            <input
                value={goal}
                placeholder="Enter your goal..."
                onChange={(e) =>
                    setGoal(
                        e.target.value
                    )
                }

                style={{
                    width: "400px",
                    padding: "10px"
                }}
            />

            <button
                onClick={
                    generateRoadmap
                }

                style={{
                    marginLeft: "10px",
                    padding: "10px"
                }}
            >

                Generate

            </button>

            {
                loading &&
                <h3>
                    Generating...
                </h3>
            }

            {
                roadmap &&
                Object.entries(
                    roadmap
                ).map(
                    (
                        [week, data]
                    ) => (

                        <div

                            key={week}

                            style={{
                                marginTop: "20px",
                                border:
                                    "1px solid #ddd",
                                padding: "20px",
                                borderRadius:
                                    "12px"
                            }}
                        >

                            <h2>
    {week.toUpperCase()}
</h2>

                            <p>

                                <strong>
                                    Daily Goal:
                                </strong>

                                {" "}

                                {
                                    data.daily_goal
                                }

                            </p>

                            <p>

                                <strong>
                                    Difficulty:
                                </strong>

                                {" "}

                                {
                                    data.difficulty_progression
                                }

                            </p>

                            <p>

                                <strong>
                                    Interview Advice:
                                </strong>

                                {" "}

                                {
                                    data.interview_preparation_advice
                                }

                            </p>

                            <h4>
                                Focus Topics
                            </h4>

                            <ul>

                                {
                                    data.focus_topics.map(
                                        topic => (

                                            <li
                                                key={
                                                    topic
                                                }
                                            >
                                                {topic}
                                            </li>
                                        )
                                    )
                                }

                            </ul>

                        </div>
                    )
                )
            }

        </div>
    );
}

export default Roadmap;