import "./StatsCard.css";

export default function StatsCard({
  title,
  value,
  icon,
  color = "accent",
  subtitle,
  badge,
  trend,
  className = "",
}) {
  return (
    <div className={`stats-card stats-card--${color} animate-fadeInUp ${className}`}>
      {/* Top row */}
      <div className="stats-card__header">
        <div className={`stats-card__icon stats-card__icon--${color}`}>
          {icon || <DefaultIcon />}
        </div>
        {badge && <span className="stats-card__badge">{badge}</span>}
      </div>

      {/* Value */}
      <div className="stats-card__value">
        {value !== undefined && value !== null
          ? typeof value === "number"
            ? value.toLocaleString()
            : value
          : "—"}
      </div>

      {/* Title */}
      <div className="stats-card__label">{title}</div>

      {/* Optional subtitle / trend */}
      {subtitle && (
        <div className="stats-card__subtitle">{subtitle}</div>
      )}
      {trend && (
        <div className={`stats-card__trend stats-card__trend--${trend.dir}`}>
          {trend.dir === "up" ? "▲" : "▼"} {trend.text}
        </div>
      )}

      {/* Glow accent line */}
      <div className={`stats-card__glow-line stats-card__glow-line--${color}`} />
    </div>
  );
}

function DefaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
    </svg>
  );
}