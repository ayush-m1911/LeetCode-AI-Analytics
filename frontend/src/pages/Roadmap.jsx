import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RoadmapCard from "../components/RoadmapCard";
import Navbar from "../components/Navbar";
import "./Roadmap.css";

const GOAL_EXAMPLES = [
  "Crack Product Based Companies",
  "Reach 1800 LeetCode Rating",
  "Improve Dynamic Programming",
  "Ace FAANG Interviews",
  "Master Graph Algorithms",
];

export default function Roadmap() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("access")) { navigate("/"); return; }
  }, [navigate]);

  // Cycle through example placeholders
  useEffect(() => {
    const id = setInterval(() => {
      setExampleIdx((i) => (i + 1) % GOAL_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const generateRoadmap = async () => {
    if (!goal.trim()) {
      setError("Please enter a goal.");
      return;
    }
    setLoading(true);
    setError("");
    setRoadmap(null);

    try {
      const { data } = await api.post("/roadmap/generate/", { goal });
      setRoadmap(data.roadmap);
      // Store timestamp for Home page Recent Activity
      localStorage.setItem("lastRoadmapGenerated", new Date().toISOString());
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to generate roadmap. Make sure your stats are synced first.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) generateRoadmap();
  };

  const roadmapEntries = roadmap ? Object.entries(roadmap) : [];

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Header */}
        <div className="roadmap-page-header animate-fadeInUp">
          <div className="roadmap-page-header__badge">
            <AIIcon />
            Groq AI Powered
          </div>
          <h1 className="roadmap-page-header__title">
            AI Roadmap Generator
          </h1>
          <p className="roadmap-page-header__subtitle">
            Describe your goal and get a personalized 4-week DSA preparation
            roadmap tailored to your current strengths and weaknesses.
          </p>
        </div>

        {/* Goal input */}
        <div className="roadmap-input-section card animate-fadeInUp">
          <div className="roadmap-input-section__label">
            <GoalIcon />
            What is your preparation goal?
          </div>

          <div className="roadmap-input-row">
            <div className="input-wrapper roadmap-input-wrapper">
              <span className="input-icon">
                <TargetIcon />
              </span>
              <input
                id="roadmap-goal-input"
                className="input-field roadmap-input"
                type="text"
                value={goal}
                onChange={(e) => { setGoal(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder={`e.g. ${GOAL_EXAMPLES[exampleIdx]}`}
                disabled={loading}
              />
            </div>

            <button
              id="generate-roadmap-btn"
              className="btn btn-primary roadmap-generate-btn"
              onClick={generateRoadmap}
              disabled={loading || !goal.trim()}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Generating…
                </>
              ) : (
                <>
                  <SparkIcon />
                  Generate
                </>
              )}
            </button>
          </div>

          {/* Suggestions */}
          <div className="roadmap-suggestions">
            <span className="roadmap-suggestions__label">Try:</span>
            {GOAL_EXAMPLES.slice(0, 3).map((ex) => (
              <button
                key={ex}
                className="roadmap-suggestion-btn"
                onClick={() => { setGoal(ex); setError(""); }}
                disabled={loading}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="roadmap-error animate-fadeIn">
              <ErrorIcon />
              {error}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="roadmap-loading animate-fadeIn">
            <div className="roadmap-loading__animation">
              <div className="roadmap-loading__brain">🧠</div>
              <div className="roadmap-loading__dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="roadmap-loading__text">
              <p>AI is crafting your personalized roadmap…</p>
              <span>Analyzing your strengths and weak areas</span>
            </div>
          </div>
        )}

        {/* Roadmap result */}
        {roadmap && roadmapEntries.length > 0 && (
          <div className="roadmap-result animate-fadeIn">
            {/* Result header */}
            <div className="roadmap-result__header">
              <div className="roadmap-result__badge">
                <CheckIcon />
                Roadmap Ready
              </div>
              <div className="roadmap-result__goal">
                Goal: <strong>{goal}</strong>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setRoadmap(null); setGoal(""); }}
              >
                Generate New
              </button>
            </div>

            {/* Timeline */}
            <div className="roadmap-timeline">
              <div className="roadmap-timeline__line" />
              <div className="roadmap-timeline__cards">
                {roadmapEntries.map(([week, data], i) => (
                  <RoadmapCard
                    key={week}
                    weekKey={week}
                    data={data}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="roadmap-tip">
              <TipIcon />
              <p>
                <strong>Pro Tip:</strong> Sync your stats regularly and regenerate your
                roadmap to get updated recommendations as you progress!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* Icons */
function AIIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}

function GoalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/>
      <path d="M12 8v4l2 2"/>
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function TipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}