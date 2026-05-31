import { useEffect, useState }
from "react";

import api
from "../api/axios";
import StatsCard
from "../components/StatsCard";
function Dashboard() {

    const [stats, setStats] =
        useState(null);

    useEffect(() => {

        const fetchStats =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/analytics/dashboard/"
                        );

                    setStats(
                        response.data
                    );

                } catch (err) {

                    console.log(err);
                }
            };

        fetchStats();

    }, []);

    if (!stats)
        return <h2>Loading...</h2>;

    return (

        <div
    style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    }}
>

    <StatsCard
        title="Total Solved"
        value={stats.total_solved}
    />

    <StatsCard
        title="Ranking"
        value={stats.ranking}
    />

    <StatsCard
        title="Easy"
        value={stats.easy_solved}
    />

    <StatsCard
        title="Medium"
        value={stats.medium_solved}
    />

    <StatsCard
        title="Hard"
        value={stats.hard_solved}
    />

</div>
    );
}

export default Dashboard;