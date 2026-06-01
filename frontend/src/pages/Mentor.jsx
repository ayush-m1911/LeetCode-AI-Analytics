import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ChatMessage from "../components/ChatMessage";
import api from "../api/axios";
import "./Mentor.css";

const SUGGESTIONS = [
  "Why am I weak in Graphs?",
  "How do I improve Dynamic Programming?",
  "What should I focus on this month?",
  "Am I interview-ready?",
  "Give me a study plan for the next 2 weeks",
];

export default function Mentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    api.get("/mentor/chat/")
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", content: msg, timestamp: new Date().toISOString(), id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "48px";

    try {
      const res = await api.post("/mentor/chat/", { message: msg });
      const aiMsg = res.data.message;
      setMessages((prev) => [...prev, { ...aiMsg, _isNew: true }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        _isNew: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-grow
    e.target.style.height = "48px";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all chat history?")) return;
    await api.delete("/mentor/chat/");
    setMessages([]);
  };

  const isEmpty = !historyLoading && messages.length === 0;

  return (
    <div className="page-wrapper">
      <div className="bg-animated" />
      <Navbar />

      <div className="mentor-page main-content" style={{ padding: 0, maxWidth: "900px" }}>
        {/* Header */}
        <div className="mentor-header">
          <div className="mentor-header-left">
            <div className="mentor-avatar">
              <BrainIcon />
            </div>
            <div>
              <div className="mentor-title">AI Mentor</div>
              <div className="mentor-subtitle">Powered by Groq · Llama 3.3 70B</div>
            </div>
          </div>
          {messages.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={handleClearHistory}>
              <TrashIcon /> Clear History
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="mentor-messages">
          {historyLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="mentor-empty">
              <div className="mentor-empty-icon">
                <BrainIcon size={32} />
              </div>
              <div>
                <h2 className="mentor-empty-title">Your DSA Mentor is Ready</h2>
                <p className="mentor-empty-subtitle">
                  Ask me anything about your LeetCode journey. I already know your stats and weak areas.
                </p>
              </div>
              <div className="mentor-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="mentor-suggestion-btn" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id || i}
                  message={msg}
                  isNew={!!msg._isNew}
                />
              ))}
            </AnimatePresence>
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="typing-indicator">
              <div className="chat-avatar chat-avatar--ai" style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                <BrainIcon size={14} />
              </div>
              <div className="typing-dots">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="mentor-input-area">
          <form className="mentor-input-form" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="mentor-textarea"
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask your mentor anything… (Enter to send, Shift+Enter for newline)"
              rows={1}
              disabled={loading}
            />
            <button
              type="submit"
              className="mentor-send-btn"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BrainIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4 20-7z"/>
      <path d="M22 2 11 13"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}
