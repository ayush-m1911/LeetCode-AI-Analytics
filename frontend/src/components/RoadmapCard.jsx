import "./RoadmapCard.css";

const WEEK_COLORS = ["accent", "cyan", "easy", "medium"];

export default function RoadmapCard({ weekKey, data, index = 0 }) {
  const color = WEEK_COLORS[index % WEEK_COLORS.length];
  const weekLabel = weekKey
    .replace(/_/g, " ")
    .replace(/\bweek\b/i, "Week")
    .toUpperCase();

  return (
    <div
      className={`roadmap-card roadmap-card--${color} animate-fadeInUp`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Timeline dot */}
      <div className={`roadmap-card__dot roadmap-card__dot--${color}`} />

      {/* Header */}
      <div className="roadmap-card__header">
        <div className={`roadmap-card__week-badge roadmap-card__week-badge--${color}`}>
          {weekLabel}
        </div>
      </div>

      {/* Focus Topics */}
      {data.focus_topics?.length > 0 && (
        <div className="roadmap-card__section">
          <div className="roadmap-card__section-label">
            <FocusIcon /> Focus Topics
          </div>
          <div className="roadmap-card__topics">
            {data.focus_topics.map((topic) => (
              <span key={topic} className={`roadmap-card__topic-tag roadmap-card__topic-tag--${color}`}>
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Daily Goal */}
      {data.daily_goal && (
        <div className="roadmap-card__section">
          <div className="roadmap-card__section-label">
            <GoalIcon /> Daily Goal
          </div>
          <p className="roadmap-card__text">{data.daily_goal}</p>
        </div>
      )}

      {/* Difficulty Progression */}
      {data.difficulty_progression && (
        <div className="roadmap-card__section">
          <div className="roadmap-card__section-label">
            <DifficultyIcon /> Difficulty
          </div>
          <p className="roadmap-card__text">{data.difficulty_progression}</p>
        </div>
      )}

      {/* Interview Advice */}
      {(data.interview_preparation_advice || data.interview_advice) && (
        <div className="roadmap-card__section roadmap-card__section--advice">
          <div className="roadmap-card__section-label">
            <AdviceIcon /> Interview Tip
          </div>
          <p className="roadmap-card__text roadmap-card__text--advice">
            {data.interview_preparation_advice || data.interview_advice}
          </p>
        </div>
      )}
    </div>
  );
}

function FocusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function GoalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function DifficultyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}

function AdviceIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8"  x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
