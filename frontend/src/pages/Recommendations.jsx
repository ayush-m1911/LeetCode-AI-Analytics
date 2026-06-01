import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import RecommendationCard from "../components/RecommendationCard";
import api from "../api/axios";
import "./Recommendations.css";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function Recommendations() {
  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedAt, setGeneratedAt] = useState(null);

  const fetchRecs = () => {
    setLoading(true);
    api.get("/recommendations/")
      .then((r) => {
        const recs = r.data.recommendations || {};
        setGrouped(recs);
        // Get latest timestamp
        const all = [...(recs.Easy || []), ...(recs.Medium || []), ...(recs.Hard || [])];
        if (all.length) setGeneratedAt(all[0].generated_at);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecs(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await api.post("/recommendations/generate/");
      const recs = res.data.recommendations || [];
      const grouped2 = {
        Easy: recs.filter((r) => r.difficulty === "Easy"),
        Medium: recs.filter((r) => r.difficulty === "Medium"),
        Hard: recs.filter((r) => r.difficulty === "Hard"),
      };
      setGrouped(grouped2);
      if (recs.length) setGeneratedAt(recs[0].generated_at);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to generate recommendations.");
    } finally {
      setGenerating(false);
    }
  };

  const hasRecs = grouped && DIFFICULTIES.some((d) => (grouped[d] || []).length > 0);

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Header */}
        <div className="recs-header">
          <div>
            <h1 className="section-title" style={{ fontSize: 28 }}>Problem Recommendations</h1>
            <p className="section-subtitle">
              AI-curated problems based on your weak topics and ranking
              {generatedAt && ` · Generated ${new Date(generatedAt).toLocaleDateString()}`}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? <SpinIcon /> : <SparkIcon />}
            {generating ? "Generating…" : hasRecs ? "Regenerate" : "Generate Recommendations"}
          </button>
        </div>

        {error && (
          <div style={{ color: "var(--hard)", fontSize: 13, marginBottom: 24, padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.2)" }}>
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div className="recs-columns">
            {DIFFICULTIES.map((d) => (
              <div key={d}>
                <div className="skeleton" style={{ height: 28, marginBottom: 16 }} />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 160, marginBottom: 12 }} />
                ))}
              </div>
            ))}
          </div>
        ) : !hasRecs ? (
          <div className="recs-generate-area">
            <div className="recs-generate-icon">🎯</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>No Recommendations Yet</h3>
            <p style={{ maxWidth: 420, margin: "0 auto 24px" }}>
              Click "Generate Recommendations" and our AI will analyze your stats and suggest the perfect problems to tackle next.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating}>
              {generating ? "Generating…" : "Generate Now"}
            </button>
          </div>
        ) : (
          <motion.div
            className="recs-columns"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {DIFFICULTIES.map((diff, colIdx) => {
              const cards = grouped[diff] || [];
              return (
                <motion.div
                  key={diff}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: colIdx * 0.08 }}
                >
                  <div className={`recs-column-header recs-column-header--${diff}`}>
                    <span className={`recs-column-label recs-column-label--${diff}`}>{diff}</span>
                    <span className="recs-column-count">{cards.length} problems</span>
                  </div>
                  <div className="recs-column-cards">
                    {cards.map((rec, i) => (
                      <motion.div
                        key={rec.id || i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: colIdx * 0.08 + i * 0.05 }}
                      >
                        <RecommendationCard rec={rec} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
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
