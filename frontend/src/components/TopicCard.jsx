function TopicCard({
    title,
    topics
}) {

    return (

        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                width: "300px",
                boxShadow:
                    "0px 2px 5px rgba(0,0,0,0.1)"
            }}
        >

            <h2
    style={{
        textAlign: "center"
    }}
>
    {title}
</h2>

            {topics.map(
                (topic) => (

                    <div
                        key={
                            topic.topic_name
                        }

                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            marginBottom:
                                "10px"
                        }}
                    >

                        <span>
                            {
                                topic.topic_name
                            }
                        </span>

                        <strong>
                            {
                                topic.solved_count
                            }
                        </strong>

                    </div>
                )
            )}

        </div>
    );
}

export default TopicCard;