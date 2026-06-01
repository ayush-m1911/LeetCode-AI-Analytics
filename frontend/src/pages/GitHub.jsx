import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import GitHubCard from "../components/GitHubCard";
import RepositoryCard from "../components/RepositoryCard";
import "./GitHub.css";

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", "C++": "#f34b7d", Go: "#00ADD8",
  Rust: "#dea584", Ruby: "#701516", HTML: "#e34c26", CSS: "#563d7c",
};

const PIE_COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#22c55e", "#ef4444", "#ec4899", "#14b8a6"];

export default function GitHub() {
  const { user } = useAuth();
  const githubUsername = user?.github_username;

  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [langData, setLangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!githubUsername) { setLoading(false); return; }

    const base = `https://api.github.com/users/${githubUsername}`;

    Promise.all([
      fetch(base).then((r) => r.json()),
      fetch(`${base}/repos?sort=updated&per_page=30`).then((r) => r.json()),
    ])
      .then(async ([prof, repoList]) => {
        if (prof.message === "Not Found") {
          setError("GitHub user not found. Check your username in Profile settings.");
          return;
        }
        setProfile(prof);

        const validRepos = Array.isArray(repoList) ? repoList.filter((r) => !r.fork) : [];
        setRepos(validRepos);

        // Aggregate language data
        const langCount = {};
        validRepos.forEach((r) => {
          if (r.language) {
            langCount[r.language] = (langCount[r.language] || 0) + 1;
          }
        });
        const sorted = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)
          .map(([name, count]) => ({ name, value: count }));
        setLangData(sorted);
      })
      .catch(() => setError("Failed to fetch GitHub data."))
      .finally(() => setLoading(false));
  }, [githubUsername]);

  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);

  if (!githubUsername) {
    return (
      <div className="page-wrapper">
        <div className="bg-animated" />
        <Navbar />
        <main className="main-content">
          <div className="github-no-username">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐙</div>
            <h2 style={{ color: "var(--text-primary)", marginBottom: 8 }}>GitHub Username Not Set</h2>
            <p style={{ marginBottom: 24 }}>Add your GitHub username in Profile to view your analytics.</p>
            <Link to="/profile" className="btn btn-primary">Go to Profile</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Header */}
        <motion.div
          className="github-page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-header">
            <div>
              <h1 className="section-title" style={{ fontSize: 28 }}>GitHub Analytics</h1>
              <p className="section-subtitle">@{githubUsername} · Public repository insights</p>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <GitHubSmallIcon /> View Profile
            </a>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="skeleton" style={{ height: 140 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
            </div>
          </div>
        ) : error ? (
          <div style={{ color: "var(--hard)", padding: "20px", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.2)" }}>
            ❌ {error}
          </div>
        ) : profile ? (
          <>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <GitHubCard profile={profile} />
            </motion.div>

            {/* Repo Stats */}
            <div className="github-stats-row">
              <StatCard label="Repositories" value={repos.length} icon="📦" />
              <StatCard label="Total Stars" value={totalStars.toLocaleString()} icon="⭐" />
              <StatCard label="Total Forks" value={totalForks.toLocaleString()} icon="🔀" />
            </div>

            {/* Language Analytics */}
            {langData.length > 0 && (
              <motion.div
                className="github-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <h2 className="section-title" style={{ fontSize: 18, marginBottom: "var(--space-4)" }}>Language Distribution</h2>
                <div className="github-charts-grid">
                  <div className="github-chart-card">
                    <div className="github-chart-title">Languages Used</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={langData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {langData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={LANG_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} repos`, name]}
                          contentStyle={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="github-chart-card">
                    <div className="github-chart-title">Top Languages</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                      {langData.map((lang, i) => {
                        const total = langData.reduce((s, l) => s + l.value, 0);
                        const pct = Math.round((lang.value / total) * 100);
                        const color = LANG_COLORS[lang.name] || PIE_COLORS[i % PIE_COLORS.length];
                        return (
                          <div key={lang.name}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
                                {lang.name}
                              </span>
                              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{pct}%</span>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Repos */}
            <motion.div
              className="github-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <h2 className="section-title" style={{ fontSize: 18, marginBottom: "var(--space-4)" }}>Recent Repositories</h2>
              <div className="repos-grid">
                {repos.slice(0, 12).map((repo) => (
                  <RepositoryCard key={repo.id} repo={repo} />
                ))}
              </div>
            </motion.div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <motion.div
      className="github-stat-card animate-fadeInUp"
      whileHover={{ y: -2 }}
    >
      <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
      <div className="github-stat-value">{value}</div>
      <div className="github-stat-label">{label}</div>
    </motion.div>
  );
}

function GitHubSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
