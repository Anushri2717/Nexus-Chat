import React from "react";

export function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const result = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      result.push(
        <ul key={`ul-${result.length}`} style={{ paddingLeft: "1.1rem", margin: "0.3rem 0", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.6 }}>
              {inlineFormat(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (/^[•\-\*]\s/.test(line)) { listItems.push(line.slice(2)); return; }
    flushList();
    if (!line.trim()) {
      result.push(<div key={i} style={{ height: "0.3rem" }} />);
    } else {
      result.push(
        <p key={i} style={{ margin: 0, lineHeight: 1.65, fontSize: "0.875rem" }}>
          {inlineFormat(line)}
        </p>
      );
    }
  });
  flushList();
  return result;
}

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ fontWeight: 600, color: "var(--text)" }}>{part.slice(2,-2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} style={{ color: "var(--text2)" }}>{part.slice(1,-1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} style={{
          background: "rgba(0,212,255,0.08)", padding: "1px 6px", borderRadius: 4,
          fontFamily: "var(--mono)", fontSize: "0.82em", color: "var(--cyan)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}>{part.slice(1,-1)}</code>
      );
    return part;
  });
}