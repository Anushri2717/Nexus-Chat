import React from "react";
import { renderMarkdown } from "./markdown";

function timeStr(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function hashColor(name) {
  const palette = [
    ["#00d4ff","#001e26"], ["#a78bfa","#1e1040"], ["#34d399","#062318"],
    ["#fb7185","#350712"], ["#fbbf24","#2e1e00"], ["#60a5fa","#071428"],
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return palette[h % palette.length];
}
function Avatar({ name, size = 32, bot = false }) {
  const [fg, bg] = bot ? ["#00d4ff", "#001e26"] : hashColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: bot ? 10 : 9, flexShrink: 0,
      background: bg, border: `1px solid ${fg}33`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--mono)", fontWeight: 700, fontSize: size * 0.34, color: fg,
    }}>
      {bot ? "AI" : name[0].toUpperCase()}
    </div>
  );
}

export default function Message({ msg, isSelf }) {
  const isBot = msg.isBot;
  const isSystem = isBot && (msg.text.includes("joined") || msg.text.includes("left"));

  if (isSystem) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.25rem 0", margin: "0.1rem 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: "0.68rem", color: "var(--text3)", whiteSpace: "nowrap" }}>
          {msg.text.replace(/\*\*/g, "")}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
    );
  }

  if (isSelf) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0.15rem 0", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, maxWidth: "68%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{timeStr(msg.timestamp)}</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--violet)", fontFamily: "var(--mono)" }}>{msg.username}</span>
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(124,99,211,0.12))",
            border: "1px solid rgba(167,139,250,0.25)",
            borderRadius: "14px 4px 14px 14px",
            padding: "0.6rem 0.9rem", fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.6,
          }}>{msg.text}</div>
        </div>
        <Avatar name={msg.username} size={30} />
      </div>
    );
  }

  if (isBot) {
    return (
      <div style={{ display: "flex", gap: 10, padding: "0.15rem 0", alignItems: "flex-start" }}>
        <Avatar name="AI" size={32} bot />
        <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "76%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--cyan)", fontFamily: "var(--mono)" }}>NexusBot</span>
            <span style={{
              fontSize: "0.58rem", background: "rgba(0,212,255,0.1)", color: "var(--cyan)",
              border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4, padding: "1px 5px",
              fontFamily: "var(--mono)", letterSpacing: "0.06em",
            }}>AI</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{timeStr(msg.timestamp)}</span>
          </div>
          <div style={{
            background: "rgba(0,212,255,0.04)",
            border: "1px solid rgba(0,212,255,0.14)",
            borderLeft: "2px solid rgba(0,212,255,0.5)",
            borderRadius: "4px 14px 14px 14px",
            padding: "0.7rem 1rem", fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.65,
          }}>
            {renderMarkdown(msg.text)}
          </div>
        </div>
      </div>
    );
  }

  const [fg] = hashColor(msg.username);
  return (
    <div style={{ display: "flex", gap: 10, padding: "0.15rem 0", alignItems: "flex-start" }}>
      <Avatar name={msg.username} size={30} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "68%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: fg, fontFamily: "var(--mono)" }}>{msg.username}</span>
          <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{timeStr(msg.timestamp)}</span>
        </div>
        <div style={{
          background: "var(--bg3)", border: "1px solid var(--border-md)",
          borderRadius: "4px 14px 14px 14px",
          padding: "0.6rem 0.9rem", fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.6,
        }}>{msg.text}</div>
      </div>
    </div>
  );
}