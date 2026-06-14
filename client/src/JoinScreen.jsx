import React, { useState, useEffect } from "react";

export default function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const canSubmit = name.trim().length >= 2;
  const submit = () => canSubmit && onJoin(name.trim());

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
      }} />
      {/* Ambient orbs */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-60%, -60%)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
        bottom: "10%", right: "10%", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "min(420px, 92vw)",
        background: "var(--bg1)",
        border: "1px solid var(--border-md)",
        borderRadius: 24, padding: "2.5rem 2rem",
        display: "flex", flexDirection: "column", gap: "1.8rem",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", textAlign: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, marginBottom: 8,
            background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(167,139,250,0.15) 100%)",
            border: "1px solid rgba(0,212,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#g1)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="url(#g2)" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.7"/>
              <path d="M2 12l10 5 10-5" stroke="url(#g3)" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.5"/>
              <defs>
                <linearGradient id="g1" x1="2" y1="7" x2="22" y2="7"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#a78bfa"/></linearGradient>
                <linearGradient id="g2" x1="2" y1="17" x2="22" y2="17"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#a78bfa"/></linearGradient>
                <linearGradient id="g3" x1="2" y1="12" x2="22" y2="12"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#a78bfa"/></linearGradient>
              </defs>
            </svg>
          </div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: 700,
            letterSpacing: "0.18em",
            background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>NEXUS CHAT</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text3)", letterSpacing: "0.04em" }}>
            Real-time group chat · Powered by Claude AI
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Input field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", fontWeight: 500 }}>
            Choose a username
          </label>
          <input
            style={{
              width: "100%", padding: "0.75rem 1rem",
              background: "var(--bg2)",
              border: `1px solid ${focused ? "rgba(0,212,255,0.4)" : "var(--border-md)"}`,
              borderRadius: "var(--radius-sm)",
              color: "var(--text)", fontSize: "0.95rem",
              boxShadow: focused ? "0 0 0 3px rgba(0,212,255,0.08)" : "none",
              transition: "border-color var(--transition), box-shadow var(--transition)",
            }}
            placeholder="e.g. alice, dev_raj, xplorer"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === "Enter" && submit()}
            maxLength={20}
            autoFocus
          />
        </div>

        <button
          onClick={submit}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: "100%", padding: "0.85rem",
            background: "linear-gradient(135deg, rgba(0,212,255,0.9), rgba(0,180,220,0.9))",
            color: "#060608", border: "none", borderRadius: "var(--radius-sm)",
            fontFamily: "var(--mono)", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.08em",
            opacity: canSubmit ? 1 : 0.45,
            cursor: canSubmit ? "pointer" : "not-allowed",
            transform: hover && canSubmit ? "scale(1.01)" : "scale(1)",
            boxShadow: hover && canSubmit
              ? "0 0 30px rgba(0,212,255,0.35), 0 4px 16px rgba(0,0,0,0.4)"
              : "0 0 20px rgba(0,212,255,0.2), 0 4px 12px rgba(0,0,0,0.3)",
            transition: "all var(--transition)",
          }}
        >ENTER ROOM →</button>

        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem",
          fontSize: "0.75rem", color: "var(--text3)", lineHeight: 1.6,
        }}>
          <span style={{ color: "var(--cyan)", fontFamily: "var(--mono)", fontSize: "0.7rem" }}>@nexus</span>
          {" "}to ask the AI ·{" "}
          <span style={{ color: "var(--violet)", fontFamily: "var(--mono)", fontSize: "0.7rem" }}>Summarize</span>
          {" "}for a chat digest · Open multiple tabs to test group chat
        </div>
      </div>
    </div>
  );
}