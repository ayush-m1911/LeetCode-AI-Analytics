import { motion } from "framer-motion";
import "./ChatMessage.css";

const fmtTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Minimal markdown renderer: bold, bullet lists, inline code
function renderContent(text) {
  const lines = text.split("\n");
  const elements = [];

  lines.forEach((line, i) => {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <li key={i} className="chat-md-li">
          {formatInline(line.slice(2))}
        </li>
      );
    } else if (line.startsWith("**") || line.trim() === "") {
      elements.push(
        <p key={i} className="chat-md-p">
          {formatInline(line)}
        </p>
      );
    } else {
      elements.push(
        <p key={i} className="chat-md-p">
          {formatInline(line)}
        </p>
      );
    }
  });
  return elements;
}

function formatInline(text) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="chat-inline-code">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function ChatMessage({ message, isNew = false }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`chat-message chat-message--${isUser ? "user" : "assistant"}`}
      initial={isNew ? { opacity: 0, y: 16, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {!isUser && (
        <div className="chat-avatar chat-avatar--ai">
          <BotIcon />
        </div>
      )}

      <div className="chat-bubble-wrapper">
        <div className={`chat-bubble chat-bubble--${isUser ? "user" : "assistant"}`}>
          {isUser ? (
            <p className="chat-md-p">{message.content}</p>
          ) : (
            <div className="chat-md">{renderContent(message.content)}</div>
          )}
        </div>
        <span className="chat-timestamp">{fmtTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <div className="chat-avatar chat-avatar--user">
          <UserIcon />
        </div>
      )}
    </motion.div>
  );
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" /><path d="M20 14h2" />
      <path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
