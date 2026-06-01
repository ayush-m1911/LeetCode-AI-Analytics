/**
 * LoadingSpinner — reusable animated spinner
 * Props:
 *   size: "sm" | "md" | "lg" (default: "md")
 *   fullscreen: bool — centers in the viewport
 *   label: string — optional text below spinner
 */
export default function LoadingSpinner({ size = "md", fullscreen = false, label }) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const px = sizeMap[size] || 32;

  const spinner = (
    <div className="spinner-wrap" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke="url(#spinner-grad)"
        style={{ animation: "spin 0.8s linear infinite" }}
        aria-label="Loading"
      >
        <defs>
          <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="3">
            <circle strokeOpacity=".2" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
      {label && (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,11,15,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 200,
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
