function StatsCard({ title, value }) {

    return (
        <div
            style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "10px",
                width: "200px"
            }}
        >
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
    );
}

export default StatsCard;