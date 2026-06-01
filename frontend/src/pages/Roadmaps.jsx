import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "./Roadmaps.css";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.get("/roadmap/list/")
      .then((r) => setRoadmaps(r.data.roadmaps || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openRoadmap = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/roadmap/${id}/`);
      setSelected(res.data);
    } catch {}
    setDetailLoading(false);
  };

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Hero */}
        <section className="roadmaps-hero animate-fadeInUp">
          <div className="section-header">
            <div>
              <h1 className="section-title" style={{ fontSize: 28 }}>Roadmap History</h1>
              <p className="section-subtitle">All your AI-generated DSA roadmaps — click to view details</p>
            </div>
            <Link to="/roadmap" className="btn btn-primary btn-sm">
              <PlusIcon /> Generate New
            </Link>
          </div>
        </section>

        {/* Grid */}
        {loading ? (
          <div className="roadmaps-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160 }} />
            ))}
          </div>
        ) : roadmaps.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            className="roadmaps-grid"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {roadmaps.map((r, i) => (
              <motion.div
                key={r.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3 }}
              >
                <RoadmapHistoryCard
                  roadmap={r}
                  index={roadmaps.length - i}
                  onClick={() => openRoadmap(r.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {(selected || detailLoading) && (
            <motion.div
              className="roadmap-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="roadmap-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="roadmap-modal-close" onClick={() => setSelected(null)}>✕</button>

                {detailLoading ? (
                  <div className="skeleton" style={{ height: 400 }} />
                ) : selected ? (
                  <>
                    <h2 className="roadmap-modal-title">{selected.goal}</h2>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                      <span className="rhc-chip">📅 {fmtDate(selected.created_at)}</span>
                      {selected.ranking && <span className="rhc-chip">🏅 Rank #{selected.ranking?.toLocaleString()}</span>}
                      {selected.total_solved && <span className="rhc-chip">✅ {selected.total_solved} solved</span>}
                    </div>
                    <RoadmapContent roadmap={selected.roadmap} />
                  </>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function RoadmapHistoryCard({ roadmap, index, onClick }) {
  return (
    <div className="roadmap-history-card" onClick={onClick}>
      <div className="rhc-number">Roadmap #{index}</div>
      <div className="rhc-goal">{roadmap.goal}</div>
      <div className="rhc-meta">
        {roadmap.ranking && (
          <span className="rhc-chip">🏅 #{roadmap.ranking?.toLocaleString()}</span>
        )}
        {roadmap.total_solved && (
          <span className="rhc-chip">✅ {roadmap.total_solved} solved</span>
        )}
      </div>
      <div className="rhc-footer">
        <span className="rhc-date">{fmtDate(roadmap.created_at)}</span>
        <span className="btn btn-ghost btn-sm" style={{ pointerEvents: "none" }}>View →</span>
      </div>
    </div>
  );
}

function RoadmapContent({ roadmap }) {
  if (!roadmap || typeof roadmap !== "object") {
    return <pre style={{ color: "var(--text-secondary)", fontSize: 12 }}>{JSON.stringify(roadmap, null, 2)}</pre>;
  }

  const weeks = Object.entries(roadmap);
  return (
    <div>
      {weeks.map(([key, val]) => (
        <div key={key} className="roadmap-week">
          <div className="roadmap-week-title">{key.replace(/_/g, " ")}</div>
          {typeof val === "object" && val !== null ? (
            Object.entries(val).map(([field, content]) => (
              <div key={field} className="roadmap-week-field">
                <strong>{field.replace(/_/g, " ")}: </strong>
                {Array.isArray(content) ? content.join(", ") : String(content)}
              </div>
            ))
          ) : (
            <div className="roadmap-week-field">{String(val)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-secondary)" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
      <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>No roadmaps yet</h3>
      <p style={{ marginBottom: 24 }}>Generate your first AI-powered DSA roadmap to get started.</p>
      <Link to="/roadmap" className="btn btn-primary">Generate Your First Roadmap</Link>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
