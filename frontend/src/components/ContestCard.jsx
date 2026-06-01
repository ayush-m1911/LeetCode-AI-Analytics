import "./ContestCard.css";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContestCard({ contest }) {
  const { contest_title, ranking, rating_change, problems_solved, total_problems, attended_at } = contest;
  const change = parseFloat(rating_change || 0);
  const changeClass = change > 0 ? "pos" : change < 0 ? "neg" : "zero";
  const changeSign = change > 0 ? "+" : "";

  return (
    <div className="contest-card">
      <div>
        <div className="contest-card-title">{contest_title}</div>
        <div className="contest-card-date">{fmtDate(attended_at)}</div>
        <div className="contest-solved">
          {problems_solved}/{total_problems} solved
        </div>
      </div>

      <div className="contest-card-meta">
        <div style={{ textAlign: "center" }}>
          <div className="contest-rank">#{ranking.toLocaleString()}</div>
          <div className="contest-rank-label">Rank</div>
        </div>
        {change !== 0 || rating_change !== undefined ? (
          <span className={`rating-change rating-change--${changeClass}`}>
            {changeSign}{change.toFixed(1)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
