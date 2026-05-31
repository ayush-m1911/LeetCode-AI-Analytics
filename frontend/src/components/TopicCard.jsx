import "./TopicCard.css";

export default function TopicCard({ title, topics = [], type = "strong" }) {
  const isStrong = type === "strong";

  return (
    <div className={`topic-card topic-card--${type}`}>
      {/* Header */}
      <div className="topic-card__header">
        <div className={`topic-card__icon-wrap topic-card__icon-wrap--${type}`}>
          {isStrong ? <StrongIcon /> : <WeakIcon />}
        </div>
        <div>
          <h3 className="topic-card__title">{title}</h3>
          <p className="topic-card__meta">{topics.length} topic{topics.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Topics list */}
      <div className="topic-card__list">
        {topics.length === 0 ? (
          <div className="topic-card__empty">
            No data yet — sync your topics first.
          </div>
        ) : (
          topics.map((topic, i) => (
            <div key={topic.topic_name} className="topic-card__item animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="topic-card__rank">{i + 1}</div>
              <div className="topic-card__info">
                <span className="topic-card__name">{topic.topic_name}</span>
                {topic.category && (
                  <span className="badge badge-muted topic-card__cat">{topic.category}</span>
                )}
              </div>
              <div className={`topic-card__count topic-card__count--${type}`}>
                {topic.solved_count}
                <span className="topic-card__solved-label">solved</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom accent */}
      <div className={`topic-card__accent topic-card__accent--${type}`} />
    </div>
  );
}

function StrongIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function WeakIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9"  x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}