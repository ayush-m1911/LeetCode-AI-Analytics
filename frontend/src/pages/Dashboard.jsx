import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/StatsCard";
import ProfileCard from "../components/ProfileCard";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("access")) { navigate("/"); return; }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/analytics/dashboard/");
      setStats(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No stats yet. Click \"Sync Stats\" to fetch your LeetCode data.");
      } else {
        setError("Failed to load stats. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user?.leetcode_username) {
      setSyncMsg("⚠️  Set your LeetCode username in your profile first.");
      return;
    }
    setSyncing(true);
    setSyncMsg("");
    try {
      await api.post("/analytics/sync/");
      setSyncMsg("✅  Stats synced successfully!");
      await fetchStats();
    } catch {
      setSyncMsg("❌  Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const totalSolved = stats?.total_solved || 0;
  const easy = stats?.easy_solved || 0;
  const medium = stats?.medium_solved || 0;
  const hard = stats?.hard_solved || 0;

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Page header */}
        <div className="dashboard-header animate-fadeInUp">
          <div>
            <h1 className="dashboard-header__title">Dashboard</h1>
            <p className="dashboard-header__subtitle">
              Your complete LeetCode profile and stats
            </p>
          </div>
          <div className="dashboard-header__actions">
            {syncMsg && (
              <span className="dashboard-sync-msg">{syncMsg}</span>
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? (
                <>
                  <span className="login-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
                  Syncing…
                </>
              ) : (
                <>
                  <SyncIcon />
                  Sync Stats
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="dashboard-grid">
            <div className="skeleton" style={{ height: 280 }} />
            <div>
              <div className="skeleton" style={{ height: 100, marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 100, marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 100 }} />
            </div>
          </div>
        ) : (
          <>
            {/* Error state */}
            {error && !stats && (
              <div className="dashboard-error animate-fadeIn">
                <InfoIcon />
                <span>{error}</span>
              </div>
            )}

            {/* Main grid */}
            <div className="dashboard-grid">
              {/* Left: Profile */}
              <div className="animate-fadeInUp">
                <ProfileCard user={user} />
              </div>

              {/* Right: Stats + Progress */}
              <div className="dashboard-right">
                {stats ? (
                  <>
                    {/* Stats row */}
                    <div className="dashboard-stats stagger-children">
                      <StatsCard
                        title="Total Solved"
                        value={totalSolved}
                        color="accent"
                        icon={<CheckIcon />}
                      />
                      <StatsCard
                        title="Global Rank"
                        value={stats.ranking}
                        color="cyan"
                        icon={<TrophyIcon />}
                      />
                    </div>

                    {/* Difficulty breakdown */}
                    <div className="difficulty-breakdown card animate-fadeInUp">
                      <div className="difficulty-breakdown__header">
                        <h3 className="difficulty-breakdown__title">Difficulty Breakdown</h3>
                        <span className="badge badge-muted">{totalSolved} total</span>
                      </div>

                      <div className="difficulty-items">
                        <DifficultyRow
                          label="Easy"
                          value={easy}
                          total={totalSolved}
                          color="easy"
                          accentColor="var(--easy)"
                        />
                        <DifficultyRow
                          label="Medium"
                          value={medium}
                          total={totalSolved}
                          color="medium"
                          accentColor="var(--medium)"
                        />
                        <DifficultyRow
                          label="Hard"
                          value={hard}
                          total={totalSolved}
                          color="hard"
                          accentColor="var(--hard)"
                        />
                      </div>
                    </div>

                    {/* Visual distribution */}
                    <div className="dist-card card animate-fadeInUp">
                      <h3 className="difficulty-breakdown__title" style={{ marginBottom: 16 }}>
                        Distribution
                      </h3>
                      <div className="dist-bar">
                        {totalSolved > 0 && (
                          <>
                            <div
                              className="dist-bar__segment dist-bar__segment--easy"
                              style={{ width: `${(easy / totalSolved) * 100}%` }}
                              title={`Easy: ${easy}`}
                            />
                            <div
                              className="dist-bar__segment dist-bar__segment--medium"
                              style={{ width: `${(medium / totalSolved) * 100}%` }}
                              title={`Medium: ${medium}`}
                            />
                            <div
                              className="dist-bar__segment dist-bar__segment--hard"
                              style={{ width: `${(hard / totalSolved) * 100}%` }}
                              title={`Hard: ${hard}`}
                            />
                          </>
                        )}
                      </div>
                      <div className="dist-legend">
                        <LegendItem color="easy"   label="Easy"   value={easy} />
                        <LegendItem color="medium" label="Medium" value={medium} />
                        <LegendItem color="hard"   label="Hard"   value={hard} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="dashboard-no-stats card">
                    <EmptyIcon />
                    <p>No stats data yet.</p>
                    <span>Click "Sync Stats" above to fetch your LeetCode data.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function DifficultyRow({ label, value, total, color, accentColor }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="diff-row">
      <div className="diff-row__info">
        <span className={`badge badge-${color}`}>{label}</span>
        <span className="diff-row__count">{value}</span>
        <span className="diff-row__pct">{pct}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: accentColor }}
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }) {
  return (
    <div className="legend-item">
      <div className={`legend-dot legend-dot--${color}`} />
      <span className="legend-label">{label}</span>
      <span className="legend-value">{value}</span>
    </div>
  );
}

/* Icons */
function SyncIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  );
}