import { useEffect, useState } from "react";
import api from "../api/axios";

import TopicChart from "../components/TopicChart";
import TopicCard from "../components/TopicCard";

function Analytics() {


const [topics, setTopics] = useState([]);

const [strongTopics,
    setStrongTopics] = useState([]);

const [weakTopics,
    setWeakTopics] = useState([]);

useEffect(() => {

    const fetchAnalytics =
        async () => {

            try {

                const topicsResponse =
                    await api.get(
                        "/analytics/topics/"
                    );

                const strongResponse =
                    await api.get(
                        "/analytics/topics/strong/"
                    );

                const weakResponse =
                    await api.get(
                        "/analytics/topics/weak/"
                    );

                setTopics(
                    topicsResponse.data
                );

                setStrongTopics(
                    strongResponse.data
                );

                setWeakTopics(
                    weakResponse.data
                );

            } catch (error) {

                console.log(error);
            }
        };

    fetchAnalytics();

}, []);

const sortedTopics =
    [...topics]
        .sort(
            (a, b) =>
                b.solved_count -
                a.solved_count
        )
        .slice(0, 10);

return (

    <div>

        <h1>
            Topic Analytics
        </h1>

        <TopicChart
            data={sortedTopics}
        />

        <div
            style={{
                display: "flex",
                gap: "30px",
                marginTop: "30px"
            }}
        >

            <TopicCard
                title="Strong Topics"
                topics={strongTopics}
            />

            <TopicCard
                title="Weak Topics"
                topics={weakTopics}
            />

        </div>

    </div>
);


}

export default Analytics;
