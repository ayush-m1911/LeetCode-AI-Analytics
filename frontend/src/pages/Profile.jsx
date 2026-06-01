import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import "./Profile.css";

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  // Editable fields
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ leetcode_username: "", github_username: "" });
  const [saving, setSaving] = useState(false);

  // Stats summary
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("access")) { navigate("/"); return; }

    // Populate form from user
    if (user) {
      setForm({
        leetcode_username: user.leetcode_username || "",
        github_username: user.github_username || "",
      });
    }

    // Fetch stats for summary
    api.get("/analytics/dashboard/")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, [user, navigate]);

  const startEdit = () => {
    setForm({
      leetcode_username: user?.leetcode_username || "",
      github_username: user?.github_username || "",
    });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/users/profile/", {
        leetcode_username: form.leetcode_username.trim(),
        github_username: form.github_username.trim(),
      });
      await refreshUser();
      setEditing(false);
      showToast("success", "Profile updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update profile.";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <main className="main-content">
        {/* Page header */}
        <div className="profile-page-header animate-fadeInUp">
          <div>
            <h1 className="profile-page-header__title">Profile</h1>
            <p className="profile-page-header__subtitle">Manage your account and coding profiles</p>
          </div>
        </div>

        <div className="profile-layout">
          {/* ===== LEFT: Profile Card ===== */}
          <div className="profile-main-card card animate-fadeInUp">
            {/* Avatar section */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-avatar__ring" />
                <div className="profile-avatar__glow" />
              </div>
              <div className="profile-avatar-info">
                <h2 className="profile-username">{user?.username}</h2>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-badges">
                  {user?.leetcode_username && (
                    <a
                      href={`https://leetcode.com/${user.leetcode_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge badge-accent"
                    >
                      <CodeIcon size={11} /> LeetCode
                    </a>
                  )}
                  {user?.github_username && (
                    <a
                      href={`https://github.com/${user.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge badge-muted"
                    >
                      <GithubIcon size={11} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Account Information (read-only) */}
            <div className="profile-section">
              <h3 className="profile-section__title">Account Information</h3>
              <div className="profile-fields">
                <ProfileField icon={<UserIcon />} label="Username" value={user?.username} />
                <ProfileField icon={<MailIcon />} label="Email" value={user?.email} />
                <ProfileField icon={<CalendarIcon />} label="Member Since" value={fmt(user?.created_at)} />
              </div>
            </div>

            <hr className="divider" />

            {/* Coding Profiles (editable) */}
            <div className="profile-section">
              <div className="profile-section__head">
                <h3 className="profile-section__title">Coding Profiles</h3>
                {!editing && (
                  <button className="btn btn-secondary btn-sm" onClick={startEdit} id="profile-edit-btn">
                    <PencilIcon /> Edit
                  </button>
                )}
              </div>

              {editing ? (
                <div className="profile-edit-form">
                  <div className="profile-edit-field">
                    <label className="profile-edit-label" htmlFor="prof-leetcode">LeetCode Username</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><CodeIcon /></span>
                      <input
                        id="prof-leetcode"
                        className="input-field"
                        type="text"
                        placeholder="Your LeetCode username"
                        value={form.leetcode_username}
                        onChange={(e) => setForm((p) => ({ ...p, leetcode_username: e.target.value }))}
                        disabled={saving}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="profile-edit-field">
                    <label className="profile-edit-label" htmlFor="prof-github">GitHub Username</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><GithubIcon /></span>
                      <input
                        id="prof-github"
                        className="input-field"
                        type="text"
                        placeholder="Your GitHub username"
                        value={form.github_username}
                        onChange={(e) => setForm((p) => ({ ...p, github_username: e.target.value }))}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="profile-edit-actions">
                    <button
                      id="profile-save-btn"
                      className="btn btn-primary btn-sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="reg-spinner" style={{ width: 12, height: 12 }} />
                          Saving…
                        </>
                      ) : (
                        <><SaveIcon /> Save Changes</>
                      )}
                    </button>
                    <button
                      id="profile-cancel-btn"
                      className="btn btn-ghost btn-sm"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-fields">
                  <ProfileField
                    icon={<CodeIcon />}
                    label="LeetCode Username"
                    value={user?.leetcode_username ? `@${user.leetcode_username}` : null}
                    href={user?.leetcode_username ? `https://leetcode.com/${user.leetcode_username}` : null}
                    empty="Not set — click Edit to add"
                    accent
                  />
                  <ProfileField
                    icon={<GithubIcon />}
                    label="GitHub Username"
                    value={user?.github_username ? `@${user.github_username}` : null}
                    href={user?.github_username ? `https://github.com/${user.github_username}` : null}
                    empty="Not set — click Edit to add"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ===== RIGHT: Stats Summary ===== */}
          <div className="profile-sidebar">
            {/* Stats */}
            <div className="card profile-stats-card animate-fadeInUp" style={{ animationDelay: "80ms" }}>
              <h3 className="profile-section__title" style={{ marginBottom: 20 }}>Statistics Summary</h3>
              {stats ? (
                <div className="profile-stat-list">
                  <StatRow label="Total Solved" value={stats.total_solved} color="accent" />
                  <StatRow label="Global Rank" value={stats.ranking ? `#${stats.ranking}` : "—"} color="cyan" />
                  <StatRow label="Easy Solved" value={stats.easy_solved} color="easy" />
                  <StatRow label="Medium Solved" value={stats.medium_solved} color="medium" />
                  <StatRow label="Hard Solved" value={stats.hard_solved} color="hard" />
                </div>
              ) : (
                <div className="profile-no-stats">
                  <ChartIcon />
                  <p>No stats yet.<br />Sync your analytics on the Dashboard.</p>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="card profile-links-card animate-fadeInUp" style={{ animationDelay: "160ms" }}>
              <h3 className="profile-section__title" style={{ marginBottom: 16 }}>Quick Links</h3>
              <div className="profile-quick-links">
                {user?.leetcode_username && (
                  <a
                    href={`https://leetcode.com/${user.leetcode_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-quick-link"
                  >
                    <span className="profile-quick-link__icon"><CodeIcon /></span>
                    <span>LeetCode Profile</span>
                    <ExternalLinkIcon />
                  </a>
                )}
                {user?.github_username && (
                  <a
                    href={`https://github.com/${user.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-quick-link"
                  >
                    <span className="profile-quick-link__icon"><GithubIcon /></span>
                    <span>GitHub Profile</span>
                    <ExternalLinkIcon />
                  </a>
                )}
                {!user?.leetcode_username && !user?.github_username && (
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Add your coding profiles above to see quick links here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Profile field display */
function ProfileField({ icon, label, value, href, empty = "Not set", accent = false }) {
  return (
    <div className="pf-field">
      <span className="pf-field__icon">{icon}</span>
      <div className="pf-field__body">
        <span className="pf-field__label">{label}</span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`pf-field__value pf-field__value--link${accent ? " pf-field__value--accent" : ""}`}
          >
            {value}
          </a>
        ) : (
          <span className={`pf-field__value${!value ? " pf-field__value--empty" : ""}`}>
            {value || empty}
          </span>
        )}
      </div>
    </div>
  );
}

/* Stat row for sidebar */
function StatRow({ label, value, color }) {
  return (
    <div className="profile-stat-row">
      <span className="profile-stat-row__label">{label}</span>
      <span className={`profile-stat-row__value profile-stat-row__value--${color}`}>{value ?? "—"}</span>
    </div>
  );
}

/* Icons */
function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function MailIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function CalendarIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function CodeIcon({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
}
function GithubIcon({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
}
function PencilIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>;
}
function SaveIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
}
function ChartIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", marginBottom: 8 }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function ExternalLinkIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto", flexShrink: 0, color: "var(--text-muted)" }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
}
