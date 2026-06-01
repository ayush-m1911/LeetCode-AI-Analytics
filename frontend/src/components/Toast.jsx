import { useEffect, useState } from "react";
import "./Toast.css";

/**
 * Toast component — renders a floating notification.
 * Props:
 *   type: "success" | "error" | "info"
 *   message: string
 *   onClose: () => void
 *   duration: number (ms, default 3500)
 */
export default function Toast({ type = "info", message, onClose, duration = 3500 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enter = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const dismiss = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350); // wait for exit animation
    }, duration);

    return () => {
      clearTimeout(enter);
      clearTimeout(dismiss);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${type}${visible ? " toast--visible" : ""}`} role="alert">
      <span className="toast__icon">
        {type === "success" && <CheckCircleIcon />}
        {type === "error" && <XCircleIcon />}
        {type === "info" && <InfoCircleIcon />}
      </span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={() => { setVisible(false); setTimeout(onClose, 350); }} aria-label="Close">
        <XSmIcon />
      </button>
    </div>
  );
}

/**
 * ToastContainer — manages a queue of toasts.
 * Usage: const { toasts, showToast } = useToast();
 *        <ToastContainer toasts={toasts} onClose={removeToast} />
 */
export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} message={t.message} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
}

/**
 * useToast hook — provides showToast(type, message) and ToastContainer wiring.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}

/* Icons */
function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function XSmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
