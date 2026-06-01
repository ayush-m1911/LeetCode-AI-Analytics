import "./RepositoryCard.css";

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", "C++": "#f34b7d", Go: "#00ADD8",
  Rust: "#dea584", Ruby: "#701516", HTML: "#e34c26", CSS: "#563d7c",
  default: "#8b8fa8",
};

export default function RepositoryCard({ repo }) {
  const { name, description, html_url, language, stargazers_count, forks_count } = repo;
  const langColor = LANG_COLORS[language] || LANG_COLORS.default;

  return (
    <a
      href={html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="repository-card"
    >
      <div className="repo-name">
        <RepoIcon />
        {name}
      </div>
      {description && <p className="repo-description">{description}</p>}
      <div className="repo-footer">
        {language && (
          <div className="repo-lang">
            <span className="repo-lang-dot" style={{ background: langColor }} />
            {language}
          </div>
        )}
        {stargazers_count > 0 && (
          <div className="repo-stat">
            <StarIcon /> {stargazers_count}
          </div>
        )}
        {forks_count > 0 && (
          <div className="repo-stat">
            <ForkIcon /> {forks_count}
          </div>
        )}
      </div>
    </a>
  );
}

function RepoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><line x1="12" y1="12" x2="12" y2="15"/>
    </svg>
  );
}
