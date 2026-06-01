import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";
import Navbar from "../components/Navbar";
import "./Home.css";

const FEATURE_CARDS = [
  {
    to: "/dashboard",
    title: "Dashboard",
    description: "View your complete profile, coding statistics, and progress at a glance.",
    icon: <DashboardIcon />,
    color: "accent",
  },
  {
    to: "/analytics",
    title: "Analytics",
    description: "Explore topic-wise strengths and weaknesses with deep visual analytics.",
    icon: <AnalyticsIcon />,
    color: "cyan",
  },
  {
    to: "/roadmap",
    title: "AI Roadmap",
    description: "Generate a personalized 4-week DSA preparation roadmap powered by AI.",
    icon: <RoadmapIcon />,
    color: "easy",
  },
  {
    to: "/roadmaps",
    title: "Roadmap History",
    description: "Browse and compare all your previously generated AI roadmaps.",
    icon: <HistoryIcon />,
    color: "medium",
  },
  {
    to: "/profile",
    title: "Profile",
    description: "Manage your account, coding profiles, and LeetCode/GitHub usernames.",
    icon: <ProfileIcon />,
    color: "purple",
  },
];

const MORE_FEATURE_CARDS = [
  {
    to: "/mentor",
    title: "AI Mentor",
    description: "One-on-one AI coaching sessions for targeted DSA improvement.",
    icon: "🤖",
    color: "purple",
  },
  {
    to: "/contests",
    title: "Contest Analytics",
    description: "Deep-dive into your contest performance, rating trends, and rankings.",
    icon: "🏆",
    color: "amber",
  },
  {
    to: "/recommendations",
    title: "Problem Recommender",
    description: "AI-curated problem sets based on your weak topics and skill gaps.",
    icon: "🎯",
    color: "cyan",
  },
  {
    to: "/github",
    title: "GitHub Analytics",
    description: "Explore your GitHub repositories, language stats, and recent activity.",
    icon: "🐙",
    color: "pink",
  },
];


const fmtDateTime = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recent activity — timestamps
  const [lastAnalyticsSync, setLastAnalyticsSync] = useState(null);
  const [lastRoadmap, setLastRoadmap] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/");
      return;
    }

    api.get("/analytics/dashboard/")
      .then((r) => {
        setStats(r.data);
        if (r.data?.updated_at) setLastAnalyticsSync(r.data.updated_at);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Roadmap timestamp is stored in localStorage when user generates one
    const roadmapTs = localStorage.getItem("lastRoadmapGenerated");
    if (roadmapTs) setLastRoadmap(roadmapTs);
  }, [navigate]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <main className="main-content">
        {/* Hero section */}
        <section className="home-hero animate-fadeInUp">
          <div className="home-hero__badge">
            <SparkIcon />
            Powered by Groq AI
          </div>
          <h1 className="home-hero__title">
            {greeting()},{" "}
            <span className="text-gradient">
              {user?.username || "Coder"}!
            </span>{" "}
            👋
          </h1>
          <p className="home-hero__subtitle">
            Your AI-powered LeetCode intelligence dashboard. Track, analyze, and
            improve with personalized insights.
          </p>
        </section>

        {/* Stats summary */}
        {(loading || stats) && (
          <section className="home-stats stagger-children">
            <div className="section-header">
              <div>
                <h2 className="section-title">Your Stats</h2>
                <p className="section-subtitle">
                  {stats
                    ? `Last synced · ${stats.updated_at ? new Date(stats.updated_at).toLocaleDateString() : "Today"}`
                    : loading
                    ? "Fetching your latest stats…"
                    : ""}
                </p>
              </div>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                View Dashboard →
              </Link>
            </div>

            {loading ? (
              <div className="home-stats__grid">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 120 }} />
                ))}
              </div>
            ) : stats ? (
              <div className="home-stats__grid">
                <StatsCard
                  title="Total Solved"
                  value={stats.total_solved}
                  color="accent"
                  icon={<TotalIcon />}
                />
                <StatsCard
                  title="Global Rank"
                  value={stats.ranking}
                  color="cyan"
                  icon={<RankIcon />}
                />
                <StatsCard
                  title="Easy"
                  value={stats.easy_solved}
                  color="easy"
                  icon={<EasyIcon />}
                />
                <StatsCard
                  title="Medium"
                  value={stats.medium_solved}
                  color="medium"
                  icon={<MediumIcon />}
                />
                <StatsCard
                  title="Hard"
                  value={stats.hard_solved}
                  color="hard"
                  icon={<HardIcon />}
                />
              </div>
            ) : null}
          </section>
        )}

        {/* Feature cards */}
        <section className="home-features">
          <div className="section-header">
            <div>
              <h2 className="section-title">Quick Access</h2>
              <p className="section-subtitle">Jump to any feature</p>
            </div>
          </div>

          <div className="home-features__grid stagger-children">
            {FEATURE_CARDS.map(({ to, title, description, icon, color }) => (
              <Link key={to} to={to} className={`home-feature-card home-feature-card--${color} animate-fadeInUp`}>
                <div className={`home-feature-card__icon home-feature-card__icon--${color}`}>
                  {icon}
                </div>
                <div className="home-feature-card__content">
                  <h3 className="home-feature-card__title">{title}</h3>
                  <p className="home-feature-card__desc">{description}</p>
                </div>
                <div className="home-feature-card__arrow">→</div>
                <div className={`home-feature-card__glow home-feature-card__glow--${color}`} />
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="home-activity animate-fadeInUp">
          <div className="section-header">
            <div>
              <h2 className="section-title">Recent Activity</h2>
              <p className="section-subtitle">Your latest actions</p>
            </div>
          </div>

          <div className="home-activity__grid">
            <ActivityCard
              icon={<SyncActivityIcon />}
              label="Last Analytics Sync"
              value={lastAnalyticsSync ? fmtDateTime(lastAnalyticsSync) : null}
              empty="No syncs yet — go to Dashboard to sync"
              color="accent"
              linkTo="/dashboard"
            />
            <ActivityCard
              icon={<RoadmapActivityIcon />}
              label="Latest Roadmap Generated"
              value={lastRoadmap ? fmtDateTime(lastRoadmap) : null}
              empty="No roadmap yet — go to AI Roadmap"
              color="easy"
              linkTo="/roadmap"
            />
          </div>
        </section>

        {/* More AI Features */}
        <section className="home-coming-soon">
          <div className="section-header">
            <div>
              <h2 className="section-title">AI-Powered Features</h2>
              <p className="section-subtitle">Advanced tools to supercharge your preparation</p>
            </div>
          </div>

          <div className="home-coming-grid stagger-children">
            {MORE_FEATURE_CARDS.map(({ to, title, description, icon }) => (
              <Link key={title} to={to} className="home-coming-card animate-fadeInUp" style={{ textDecoration: "none" }}>
                <div className="home-coming-card__icon">{icon}</div>
                <h3 className="home-coming-card__title">{title}</h3>
                <p className="home-coming-card__desc">{description}</p>
                <div style={{ marginTop: "auto", fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>Open →</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===== Activity Card ===== */
function ActivityCard({ icon, label, value, empty, color, linkTo }) {
  return (
    <Link to={linkTo} className={`home-activity-card home-activity-card--${color}`}>
      <div className={`home-activity-card__icon home-activity-card__icon--${color}`}>
        {icon}
      </div>
      <div className="home-activity-card__body">
        <span className="home-activity-card__label">{label}</span>
        {value ? (
          <span className="home-activity-card__value">{value}</span>
        ) : (
          <span className="home-activity-card__empty">{empty}</span>
        )}
      </div>
      <span className="home-activity-card__arrow">→</span>
    </Link>
  );
}

/* ===== Icons ===== */
function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}

function RoadmapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  );
}


function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function TotalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

function RankIcon() {
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

function EasyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9"  x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function HardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 2 1.88 1.88"/>
      <path d="M14.12 3.88 16 2"/>
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
      <path d="M12 20v-9"/>
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
      <path d="M6 13H2"/>
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
      <path d="M22 13h-4"/>
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
    </svg>
  );
}

function SyncActivityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

function RoadmapActivityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}