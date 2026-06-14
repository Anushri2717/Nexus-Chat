import React, { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "./socket";
import JoinScreen from "./JoinScreen";
import Sidebar from "./Sidebar";
import Message from "./Message";

export default function App() {
  const [username, setUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("history", (hist) => setMessages(hist));
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("users", (list) => setUsers(list));
    socket.on("bot_typing", (v) => setBotTyping(v));
    return () => {
      socket.off("connect"); socket.off("disconnect");
      socket.off("history"); socket.off("message");
      socket.off("users"); socket.off("bot_typing");
    };
  }, []);

  const handleJoin = useCallback((name) => {
    socket.connect();
    socket.once("connect", () => {
      socket.emit("join", name);
      setUsername(name);
      setTimeout(() => inputRef.current?.focus(), 100);
    });
  }, []);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !connected) return;
    socket.emit("message", { text });
    setInput("");
    inputRef.current?.focus();
  };

  if (!username) return <JoinScreen onJoin={handleJoin} />;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <Sidebar
        users={users}
        currentUser={username}
        onSummarize={() => !botTyping && socket.emit("summarize")}
        botTyping={botTyping}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: 56, flexShrink: 0,
          background: "var(--bg1)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.25rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--cyan)", fontWeight: 700 }}>#</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>general</span>
            <div style={{ width: 1, height: 14, background: "var(--border-md)", margin: "0 4px" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
              {users.length} member{users.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {botTyping && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.15)",
                borderRadius: 99, padding: "3px 10px",
              }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 4, height: 4, borderRadius: "50%",
                      background: "var(--cyan)",
                      animation: `bounce 1.2s ${i*0.18}s infinite`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.68rem", color: "var(--cyan)", fontFamily: "var(--mono)" }}>AI typing</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: connected ? "var(--emerald)" : "var(--rose)",
                boxShadow: connected ? "0 0 8px rgba(52,211,153,0.6)" : "0 0 8px rgba(251,113,133,0.6)",
              }} />
              <span style={{ fontSize: "0.7rem", color: "var(--text3)", fontFamily: "var(--mono)" }}>
                {connected ? "live" : "connecting"}
              </span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "1rem 1.25rem",
          display: "flex", flexDirection: "column", gap: "0.05rem",
        }}>
          {messages.length === 0 && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 12, opacity: 0.5, paddingTop: "4rem",
            }}>
              <div style={{ fontSize: "2rem" }}>⬡</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text3)", textAlign: "center" }}>
                No messages yet. Say hello or ask{" "}
                <span style={{ color: "var(--cyan)", fontFamily: "var(--mono)" }}>@nexus</span> something!
              </div>
            </div>
          )}
          {messages.map(msg => (
            <Message key={msg.id} msg={msg} isSelf={msg.username === username} />
          ))}
          {botTyping && (
            <div style={{ display: "flex", gap: 10, padding: "0.15rem 0", alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: "#001e26", border: "1px solid rgba(0,212,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--mono)", fontWeight: 700, fontSize: 11, color: "var(--cyan)",
              }}>AI</div>
              <div style={{
                background: "rgba(0,212,255,0.04)",
                border: "1px solid rgba(0,212,255,0.14)",
                borderLeft: "2px solid rgba(0,212,255,0.4)",
                borderRadius: "4px 14px 14px 14px",
                padding: "0.75rem 1rem",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--cyan)", opacity: 0.7,
                    animation: `bounce 1.2s ${i*0.18}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "0.85rem 1.25rem 1rem",
          background: "var(--bg1)",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", gap: 8, alignItems: "center",
            background: "var(--bg2)",
            border: `1px solid ${inputFocused ? "rgba(0,212,255,0.3)" : "var(--border-md)"}`,
            borderRadius: 14, padding: "0 0.5rem 0 1rem",
            transition: "border-color var(--transition), box-shadow var(--transition)",
            boxShadow: inputFocused ? "0 0 0 3px rgba(0,212,255,0.07)" : "none",
          }}>
            <input
              ref={inputRef}
              style={{
                flex: 1, background: "transparent", border: "none",
                padding: "0.72rem 0",
                color: "var(--text)", fontSize: "0.9rem", letterSpacing: "0.01em",
              }}
              placeholder={`Message as ${username} — try @nexus <question>`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              disabled={!connected}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !connected}
              style={{
                padding: "0.45rem 0.9rem",
                background: input.trim() && connected
                  ? "linear-gradient(135deg, rgba(0,212,255,0.9), rgba(0,180,220,0.85))"
                  : "var(--bg3)",
                border: "none", borderRadius: 9,
                color: input.trim() && connected ? "#060608" : "var(--text3)",
                fontFamily: "var(--mono)", fontWeight: 700, fontSize: "0.72rem",
                letterSpacing: "0.06em",
                transition: "all var(--transition)",
                cursor: input.trim() && connected ? "pointer" : "not-allowed",
                flexShrink: 0,
              }}
            >SEND</button>
          </div>
          <div style={{ marginTop: "0.4rem", fontSize: "0.65rem", color: "var(--text3)", paddingLeft: 4 }}>
            Press <span style={{ fontFamily: "var(--mono)" }}>Enter</span> to send
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.7; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}