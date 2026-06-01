/**
 * RefreshButton — reusable button with spinning icon during loading.
 * Props:
 *   loading: bool
 *   onClick: fn
 *   label: string (default: "Refresh")
 *   loadingLabel: string (default: "Refreshing…")
 *   disabled: bool
 *   className: string (extra CSS classes)
 *   size: "sm" | "md" | "lg"
 */
export default function RefreshButton({
  loading = false,
  onClick,
  label = "Refresh",
  loadingLabel = "Refreshing…",
  disabled = false,
  className = "",
  size = "sm",
}) {
  return (
    <button
      className={`btn btn-primary btn-${size} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ minWidth: 120 }}
    >
      {loading ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: size === "sm" ? 13 : 16,
              height: size === "sm" ? 13 : 16,
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 0.75s linear infinite",
              flexShrink: 0,
            }}
          />
          {loadingLabel}
        </>
      ) : (
        <>
          <RefreshIcon size={size === "sm" ? 13 : 16} />
          {label}
        </>
      )}
    </button>
  );
}

function RefreshIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}
