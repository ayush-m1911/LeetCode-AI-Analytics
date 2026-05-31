import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TopicChart from "../components/TopicChart";
import TopicCard from "../components/TopicCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./Analytics.css";

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [strongTopics, setStrongTopics] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("access")) { navigate("/"); return; }
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const [topicsRes, strongRes, weakRes] = await Promise.all([
        api.get("/analytics/topics/"),
        api.get("/analytics/topics/strong/"),
        api.get("/analytics/topics/weak/"),
      ]);
      setTopics(topicsRes.data);
      setStrongTopics(strongRes.data);
      setWeakTopics(weakRes.data);
    } catch (err) {
      setError("No topic data found. Sync your topics to see analytics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTopics = async () => {
    if (!user?.leetcode_username) {
      setSyncMsg("⚠️  Set your LeetCode username in Dashboard first.");
      return;
    }
    setSyncing(true);
    setSyncMsg("");
    try {
      await api.post("/analytics/topics/sync/");
      setSyncMsg("✅  Topics synced!");
      await fetchAnalytics();
    } catch {
      setSyncMsg("❌  Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const sortedTopics = [...topics]
    .sort((a, b) => b.solved_count - a.solved_count)
    .slice(0, 10);

  const totalTopics = topics.length;
  const totalSolved = topics.reduce((s, t) => s + t.solved_count, 0);

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Header */}
        <div className="analytics-header animate-fadeInUp">
          <div>
            <h1 className="analytics-header__title">Analytics</h1>
            <p className="analytics-header__subtitle">
              Topic-wise performance breakdown and insights
            </p>
          </div>
          <div className="analytics-header__actions">
            {syncMsg && <span className="analytics-sync-msg">{syncMsg}</span>}
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSyncTopics}
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
                  Sync Topics
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary row */}
        {!loading && topics.length > 0 && (
          <div className="analytics-summary stagger-children animate-fadeInUp">
            <div className="analytics-summary__item">
              <span className="analytics-summary__value">{totalTopics}</span>
              <span className="analytics-summary__label">Topics Tracked</span>
            </div>
            <div className="analytics-summary__divider" />
            <div className="analytics-summary__item">
              <span className="analytics-summary__value">{totalSolved}</span>
              <span className="analytics-summary__label">Total Solved</span>
            </div>
            <div className="analytics-summary__divider" />
            <div className="analytics-summary__item">
              <span className="analytics-summary__value">
                {strongTopics[0]?.topic_name || "—"}
              </span>
              <span className="analytics-summary__label">Top Topic</span>
            </div>
            <div className="analytics-summary__divider" />
            <div className="analytics-summary__item">
              <span className="analytics-summary__value analytics-summary__value--warn">
                {weakTopics[0]?.topic_name || "—"}
              </span>
              <span className="analytics-summary__label">Needs Work</span>
            </div>
          </div>
        )}

        {/* Error / empty */}
        {error && (
          <div className="analytics-error animate-fadeIn">
            <InfoIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="analytics-skeleton">
            <div className="skeleton" style={{ height: 360 }} />
            <div className="analytics-cards-grid">
              <div className="skeleton" style={{ height: 280 }} />
              <div className="skeleton" style={{ height: 280 }} />
            </div>
          </div>
        ) : (
          <>
            {/* Chart */}
            {sortedTopics.length > 0 && (
              <div className="analytics-chart-section animate-fadeInUp">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Top 10 Topics</h2>
                    <p className="section-subtitle">Sorted by problems solved</p>
                  </div>
                </div>
                <TopicChart data={sortedTopics} />
              </div>
            )}

            {/* Strong / Weak */}
            <div className="analytics-cards-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Strength Analysis</h2>
                  <p className="section-subtitle">Your top 5 strong and weak areas</p>
                </div>
              </div>

              <div className="analytics-cards-grid stagger-children">
                <TopicCard
                  title="Strong Topics"
                  topics={strongTopics}
                  type="strong"
                />
                <TopicCard
                  title="Weak Topics"
                  topics={weakTopics}
                  type="weak"
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SyncIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
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
