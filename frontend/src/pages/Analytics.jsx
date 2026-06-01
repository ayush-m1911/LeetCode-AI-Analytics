import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TopicChart from "../components/TopicChart";
import TopicCard from "../components/TopicCard";
import Navbar from "../components/Navbar";
import RefreshButton from "../components/RefreshButton";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, useToast } from "../components/Toast";
import "./Analytics.css";

const fmtDateTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
};

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [topics, setTopics] = useState([]);
  const [strongTopics, setStrongTopics] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

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
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError("No topic data found. Sync your topics to see analytics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTopics = async () => {
    if (!user?.leetcode_username) {
      showToast("info", "Set your LeetCode username in Profile first.");
      return;
    }
    setSyncing(true);
    try {
      await api.post("/analytics/topics/sync/");
      await fetchAnalytics();
      showToast("success", "Topics Refreshed Successfully");
    } catch {
      showToast("error", "Unable to refresh topics");
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
      <ToastContainer toasts={toasts} onClose={removeToast} />

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
            {lastUpdated && (
              <span className="analytics-last-updated">
                <ClockIcon />
                Last Updated: {fmtDateTime(lastUpdated)}
              </span>
            )}
            <RefreshButton
              loading={syncing}
              onClick={handleSyncTopics}
              label="Refresh Topics"
              loadingLabel="Refreshing Topics…"
            />
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

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
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
