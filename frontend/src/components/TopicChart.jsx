import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
}
from "recharts";

function TopicChart({ data }) {

    return (

        <ResponsiveContainer
            width="100%"
            height={500}
        >

            <BarChart
                data={data}
            >

                <CartesianGrid />

                <XAxis
                    dataKey="topic_name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                    dataKey="solved_count"
                />

            </BarChart>

        </ResponsiveContainer>
    );
}

export default TopicChart;