import "./RecommendationCard.css";

export default function RecommendationCard({ rec }) {
  const { title, difficulty, topic, reason, leetcode_url } = rec;

  return (
    <div className={`recommendation-card recommendation-card--${difficulty}`}>
      <div className="rec-card-header">
        <h3 className="rec-card-title">{title}</h3>
        <span className={`badge badge-${difficulty.toLowerCase()}`}>{difficulty}</span>
      </div>

      <span className="rec-topic-chip">
        <TagIcon /> {topic}
      </span>

      <p className="rec-reason">{reason}</p>

      <a
        href={leetcode_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`rec-solve-btn rec-solve-btn--${difficulty}`}
      >
        Solve Problem
        <ExternalIcon />
      </a>
    </div>
  );
}

function TagIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
      <path d="M7 7h.01"/>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
