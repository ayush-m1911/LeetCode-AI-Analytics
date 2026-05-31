import "./ProfileCard.css";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ProfileCard({ user }) {
  if (!user) return null;

  const initials = user.username?.slice(0, 2).toUpperCase() || "??";

  const fields = [
    {
      label: "Username",
      value: user.username,
      icon: <UserIcon />,
    },
    {
      label: "Email",
      value: user.email,
      icon: <EmailIcon />,
    },
    {
      label: "LeetCode",
      value: user.leetcode_username
        ? `@${user.leetcode_username}`
        : "Not set",
      icon: <CodeIcon />,
      href: user.leetcode_username
        ? `https://leetcode.com/${user.leetcode_username}`
        : null,
      accent: !!user.leetcode_username,
    },
    {
      label: "GitHub",
      value: user.github_username
        ? `@${user.github_username}`
        : "Not set",
      icon: <GithubIcon />,
      href: user.github_username
        ? `https://github.com/${user.github_username}`
        : null,
      accent: !!user.github_username,
    },
    {
      label: "Member Since",
      value: formatDate(user.created_at),
      icon: <CalendarIcon />,
    },
  ];

  return (
    <div className="profile-card animate-scaleIn">
      {/* Header */}
      <div className="profile-card__header">
        <div className="profile-card__avatar">
          {initials}
          <div className="profile-card__avatar-ring" />
        </div>
        <div className="profile-card__identity">
          <h2 className="profile-card__name">{user.username}</h2>
          {user.email && <p className="profile-card__email">{user.email}</p>}
          <div className="profile-card__badges">
            {user.leetcode_username && (
              <a
                href={`https://leetcode.com/${user.leetcode_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="badge badge-accent"
              >
                <CodeIcon /> LeetCode
              </a>
            )}
            {user.github_username && (
              <a
                href={`https://github.com/${user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="badge badge-muted"
              >
                <GithubIcon /> GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Fields */}
      <div className="profile-card__fields">
        {fields.map(({ label, value, icon, href, accent }) => (
          <div key={label} className="profile-card__field">
            <div className="profile-card__field-icon">{icon}</div>
            <div className="profile-card__field-body">
              <span className="profile-card__field-label">{label}</span>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`profile-card__field-value profile-card__field-value--link${accent ? " profile-card__field-value--accent" : ""}`}
                >
                  {value}
                </a>
              ) : (
                <span className={`profile-card__field-value${!value ? " profile-card__field-value--empty" : ""}`}>
                  {value || "Not set"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  );
}
