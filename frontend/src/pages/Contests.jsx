import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import Navbar from "../components/Navbar";
import ContestCard from "../components/ContestCard";
import api from "../api/axios";
import "./Contests.css";

function fmtShortDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card-hover)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      fontSize: 12,
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(0) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Contests() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = () => {
    setLoading(true);
    api.get("/contests/history/")
      .then((r) => setData(r.data))
      .catch(() => setError("Failed to load contest history."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    try {
      const res = await api.post("/contests/sync/");
      if (res.data.synced > 0) fetchHistory();
      else setError(res.data.message || "No contests found.");
    } catch (e) {
      setError(e.response?.data?.error || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const history = data?.history || [];
  const stats = data?.stats || {};

  // Build chart data (chronological)
  const chartData = [...history].reverse().map((c) => ({
    name: fmtShortDate(c.attended_at),
    Rating: Math.round(c.rating || 0),
    Rank: c.ranking,
    Change: parseFloat(c.rating_change || 0),
  }));

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Header */}
        <motion.section
          className="animate-fadeInUp"
          style={{ marginBottom: "var(--space-8)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-header">
            <div>
              <h1 className="section-title" style={{ fontSize: 28 }}>Contest Analytics</h1>
              <p className="section-subtitle">Your LeetCode contest performance over time</p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? <SpinIcon /> : <SyncIcon />}
              {syncing ? "Syncing…" : "Sync Contests"}
            </button>
          </div>
          {error && (
            <div style={{ color: "var(--medium)", fontSize: 13, marginTop: 8, padding: "8px 12px", background: "rgba(245,158,11,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(245,158,11,0.2)" }}>
              ⚠️ {error}
            </div>
          )}
        </motion.section>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 100 }} />
            ))}
          </div>
        ) : history.length === 0 ? (
          <NoContests onSync={handleSync} syncing={syncing} />
        ) : (
          <>
            {/* Stats */}
            <motion.div
              className="contests-stats-grid stagger-children"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <StatCard label="Total Contests" value={stats.total_contests || 0} />
              <StatCard label="Best Rank" value={`#${(stats.best_rank || 0).toLocaleString()}`} />
              <StatCard label="Avg Rank" value={`#${(stats.average_rank || 0).toLocaleString()}`} />
              <StatCard label="Best Rating" value={Math.round(stats.best_rating || 0)} />
            </motion.div>

            {/* Charts */}
            {chartData.length > 1 && (
              <div className="contests-charts-grid">
                <div className="contest-chart-card animate-fadeInUp">
                  <div className="contest-chart-title">Rating Trend</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="Rating" stroke="#8b5cf6" strokeWidth={2} fill="url(#ratingGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="contest-chart-card animate-fadeInUp">
                  <div className="contest-chart-title">Rank Trend <span style={{ fontSize: 11, color: "var(--text-muted)" }}>(lower = better)</span></div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis reversed tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="Rank" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* History list */}
            <div>
              <div className="contests-list-header">
                <h2 className="section-title" style={{ fontSize: 18 }}>Contest History</h2>
                <span className="badge badge-accent">{history.length} contests</span>
              </div>
              <div className="contests-list">
                {history.map((c) => (
                  <ContestCard key={c.id} contest={c} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="contest-stat-card animate-fadeInUp">
      <div className="contest-stat-value">{value}</div>
      <div className="contest-stat-label">{label}</div>
    </div>
  );
}

function NoContests({ onSync, syncing }) {
  return (
    <div className="no-contests">
      <div className="no-contests-icon">🏆</div>
      <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>No Contest Data</h3>
      <p style={{ marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
        Sync your LeetCode contest history to see your performance charts and ranking trends.
      </p>
      <button className="btn btn-primary" onClick={onSync} disabled={syncing}>
        {syncing ? <SpinIcon /> : <SyncIcon />}
        {syncing ? "Syncing…" : "Sync Contest History"}
      </button>
    </div>
  );
}

function SyncIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
