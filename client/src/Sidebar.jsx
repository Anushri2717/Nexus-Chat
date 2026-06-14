import React, { useState } from "react";

function hashColor(name) {
  const palette = [
    ["#00d4ff","#001e26"], ["#a78bfa","#1e1040"], ["#34d399","#062318"],
    ["#fb7185","#350712"], ["#fbbf24","#2e1e00"], ["#60a5fa","#071428"],
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return palette[h % palette.length];
}

function Avatar({ name, size = 30, bot = false }) {
  const [fg, bg] = bot ? ["#00d4ff", "#001e26"] : hashColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: bot ? 10 : 9, flexShrink: 0,
      background: bg, border: `1px solid ${fg}33`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--mono)", fontWeight: 700,
      fontSize: size * 0.35, color: fg, letterSpacing: "0.02em",
    }}>
      {bot ? "AI" : name[0].toUpperCase()}
    </div>
  );
}

export default function Sidebar({ users, currentUser, onSummarize, botTyping }) {
  const [sumHover, setSumHover] = useState(false);
  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: "var(--bg1)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.25rem 1.1rem 1rem",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(167,139,250,0.15))",
          border: "1px solid rgba(0,212,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#sg1)" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#sg2)" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.6"/>
            <defs>
              <linearGradient id="sg1" x1="2" y1="2" x2="22" y2="12"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#a78bfa"/></linearGradient>
              <linearGradient id="sg2" x1="2" y1="12" x2="22" y2="22"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#a78bfa"/></linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text)" }}>NEXUS</div>
          <div style={{ fontSize: "0.65rem", color: "var(--text3)", letterSpacing: "0.04em" }}>group chat</div>
        </div>
      </div>

      {/* Channel badge */}
      <div style={{ padding: "0.9rem 1.1rem 0.6rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.5rem", fontWeight: 500 }}>Channel</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0.5rem 0.65rem",
          background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.12)",
          borderRadius: 8,
        }}>
          <span style={{ color: "var(--cyan)", fontSize: "0.85rem", fontFamily: "var(--mono)" }}>#</span>
          <span style={{ fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>general</span>
        </div>
      </div>

      {/* Users list */}
      <div style={{ padding: "0.6rem 1.1rem", flex: 1, overflowY: "auto" }}>
        <div style={{
          fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--text3)", marginBottom: "0.6rem", fontWeight: 500,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          Online
          <span style={{
            background: "rgba(52,211,153,0.15)", color: "var(--emerald)",
            border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: 99, padding: "0 6px", fontSize: "0.62rem",
            fontFamily: "var(--mono)", fontWeight: 700,
          }}>{users.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {users.map(u => (
            <div key={u} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0.4rem 0.5rem", borderRadius: 8,
              background: u === currentUser ? "rgba(167,139,250,0.07)" : "transparent",
              border: `1px solid ${u === currentUser ? "rgba(167,139,250,0.12)" : "transparent"}`,
            }}>
              <div style={{ position: "relative" }}>
                <Avatar name={u} size={28} />
                <div style={{
                  position: "absolute", bottom: -1, right: -1,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--emerald)", border: "1.5px solid var(--bg1)",
                  boxShadow: "0 0 6px rgba(52,211,153,0.6)",
                }} />
              </div>
              <span style={{
                fontSize: "0.8rem", fontWeight: u === currentUser ? 600 : 400,
                color: u === currentUser ? "var(--violet)" : "var(--text2)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {u}{u === currentUser ? " ·you" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI panel */}
      <div style={{
        padding: "0.9rem 1.1rem 1.1rem",
        borderTop: "1px solid var(--border)",
        background: "rgba(0,212,255,0.02)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.7rem", fontWeight: 500 }}>NexusBot AI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.8rem" }}>
          <Avatar name="AI" size={30} bot />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)" }}>NexusBot</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: botTyping ? "var(--amber)" : "var(--emerald)",
                boxShadow: botTyping ? "0 0 6px var(--amber)" : "0 0 6px var(--emerald)",
                animation: botTyping ? "blink 1s infinite" : "none",
              }} />
              <span style={{ fontSize: "0.68rem", color: "var(--text3)" }}>
                {botTyping ? "thinking..." : "ready"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSummarize}
          disabled={botTyping}
          onMouseEnter={() => setSumHover(true)}
          onMouseLeave={() => setSumHover(false)}
          style={{
            width: "100%", padding: "0.6rem 0.75rem",
            background: sumHover && !botTyping ? "rgba(167,139,250,0.1)" : "transparent",
            border: `1px solid ${sumHover && !botTyping ? "rgba(167,139,250,0.3)" : "var(--border-md)"}`,
            borderRadius: 9,
            color: botTyping ? "var(--text3)" : "var(--violet)",
            fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: 500,
            letterSpacing: "0.05em",
            cursor: botTyping ? "not-allowed" : "pointer",
            transition: "all var(--transition)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          SUMMARIZE CHAT
        </button>

        <div style={{ marginTop: "0.65rem", fontSize: "0.67rem", color: "var(--text3)", lineHeight: 1.6 }}>
          Type{" "}
          <span style={{ color: "var(--cyan)", fontFamily: "var(--mono)" }}>@nexus &lt;question&gt;</span>
          {" "}to ask the AI
        </div>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </aside>
  );
}