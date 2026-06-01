import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    leetcode_username: "",
    github_username: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    else if (form.username.length < 3) e.username = "Username must be at least 3 characters.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await api.post("/users/register/", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        leetcode_username: form.leetcode_username.trim(),
        github_username: form.github_username.trim(),
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (data.username) setErrors((p) => ({ ...p, username: data.username[0] }));
        if (data.email) setErrors((p) => ({ ...p, email: data.email[0] }));
        if (data.password) setErrors((p) => ({ ...p, password: data.password[0] }));
        if (data.non_field_errors) setApiError(data.non_field_errors[0]);
        else if (data.detail) setApiError(data.detail);
        else if (!data.username && !data.email && !data.password)
          setApiError("Registration failed. Please try again.");
      } else {
        setApiError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="bg-animated" />
      <div className="reg-bg-grid" />

      {/* Floating particles */}
      <div className="reg-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`reg-particle reg-particle--${i + 1}`} />
        ))}
      </div>

      <div className="reg-container">
        {/* Left brand panel */}
        <div className="reg-brand">
          <div className="reg-brand__inner">
            <div className="reg-brand__logo"><BrainIcon /></div>
            <h1 className="reg-brand__title">
              Start your<br />
              <span className="text-gradient">AI Journey</span>
            </h1>
            <p className="reg-brand__desc">
              Join thousands of coders who use AI-powered analytics to level up their LeetCode performance.
            </p>
            <div className="reg-brand__features">
              {[
                { icon: "📊", text: "Topic-wise analytics" },
                { icon: "🧠", text: "AI-powered roadmaps" },
                { icon: "🎯", text: "Strength & weakness analysis" },
                { icon: "🏆", text: "Track global ranking" },
              ].map(({ icon, text }) => (
                <div key={text} className="reg-feature">
                  <span className="reg-feature__icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reg-brand__glow" />
        </div>

        {/* Right register card */}
        <div className="reg-card animate-scaleIn">
          {success ? (
            <div className="reg-success animate-fadeIn">
              <div className="reg-success__icon"><SuccessIcon /></div>
              <h2 className="reg-success__title">Account Created!</h2>
              <p className="reg-success__desc">
                Your account is ready. Redirecting to login…
              </p>
              <div className="reg-success__bar">
                <div className="reg-success__fill" />
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="reg-card__header">
                <div className="reg-card__icon"><UserPlusIcon /></div>
                <h2 className="reg-card__title">Create account</h2>
                <p className="reg-card__subtitle">Fill in the details to get started</p>
              </div>

              {/* API error */}
              {apiError && (
                <div className="reg-error animate-fadeIn">
                  <ErrorIcon />
                  <span>{apiError}</span>
                </div>
              )}

              <form className="reg-form" onSubmit={handleSubmit} noValidate>
                {/* Section: Account Information */}
                <div className="reg-section-label">Account Information</div>

                {/* Username */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-username">Username</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><UserIcon /></span>
                    <input
                      id="reg-username"
                      className={`input-field${errors.username ? " input-field--error" : ""}`}
                      type="text"
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={set("username")}
                      autoComplete="username"
                      autoFocus
                      disabled={loading}
                    />
                  </div>
                  {errors.username && <span className="reg-field__error">{errors.username}</span>}
                </div>

                {/* Email */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><MailIcon /></span>
                    <input
                      id="reg-email"
                      className={`input-field${errors.email ? " input-field--error" : ""}`}
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={set("email")}
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && <span className="reg-field__error">{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LockIcon /></span>
                    <input
                      id="reg-password"
                      className={`input-field${errors.password ? " input-field--error" : ""}`}
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={set("password")}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button type="button" className="input-action" onClick={() => setShowPassword((p) => !p)} aria-label="Toggle password">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && <span className="reg-field__error">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-confirm">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LockIcon /></span>
                    <input
                      id="reg-confirm"
                      className={`input-field${errors.confirmPassword ? " input-field--error" : ""}`}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button type="button" className="input-action" onClick={() => setShowConfirm((p) => !p)} aria-label="Toggle confirm password">
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="reg-field__error">{errors.confirmPassword}</span>}
                </div>

                {/* Section: Profile Information */}
                <div className="reg-section-label" style={{ marginTop: 8 }}>Profile Information <span className="reg-optional">(optional)</span></div>

                {/* LeetCode Username */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-leetcode">LeetCode Username</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><CodeIcon /></span>
                    <input
                      id="reg-leetcode"
                      className="input-field"
                      type="text"
                      placeholder="Your LeetCode username"
                      value={form.leetcode_username}
                      onChange={set("leetcode_username")}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* GitHub Username */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-github">GitHub Username</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><GithubIcon /></span>
                    <input
                      id="reg-github"
                      className="input-field"
                      type="text"
                      placeholder="Your GitHub username"
                      value={form.github_username}
                      onChange={set("github_username")}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="reg-submit-btn"
                  type="submit"
                  className="btn btn-primary btn-lg reg-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="reg-spinner" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlusIcon />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="reg-card__footer">
                <p className="reg-card__footer-text">
                  Already have an account?{" "}
                  <Link to="/" className="reg-link">Sign In</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Icons ===== */
function BrainIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}
function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
function SuccessIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
