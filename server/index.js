require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const messageHistory = [];
const activeUsers = new Map();

const getContextMessages = (n = 30) =>
  messageHistory.slice(-n).map((m) => `[${m.username}]: ${m.text}`).join("\n");

async function askAI(userQuestion, chatContext) {
  const prompt = `You are NexusBot, a helpful AI assistant inside a real-time group chat.
Be concise, friendly, and conversational. Use short paragraphs.

Recent chat context (use it when relevant):
---
${chatContext}
---

User's question: ${userQuestion}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function summarizeChat(chatContext) {
  if (!chatContext.trim()) return "No messages to summarize yet!";

  const prompt = `You are NexusBot. Summarize the following group chat in 3-5 concise bullet points. Be factual and neutral.

Conversation:
${chatContext}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("history", messageHistory);
  socket.emit("users", Array.from(activeUsers.values()));

  socket.on("join", (username) => {
    activeUsers.set(socket.id, username);
    io.emit("users", Array.from(activeUsers.values()));
    const sysMsg = buildBotMsg(`**${username}** joined the chat 👋`);
    messageHistory.push(sysMsg);
    io.emit("message", sysMsg);
  });

  socket.on("message", async (data) => {
    const { text } = data;
    const username = activeUsers.get(socket.id) || "Anonymous";

    const msg = {
      id: Date.now(),
      username,
      text,
      timestamp: new Date().toISOString(),
      isBot: false,
    };
    messageHistory.push(msg);
    io.emit("message", msg);

    const lower = text.trim().toLowerCase();
    if (lower.startsWith("@nexus") || lower.startsWith("@bot")) {
      const question = text.replace(/^@\w+\s*/i, "").trim();
      if (!question) return;

      io.emit("bot_typing", true);
      try {
        const answer = await askAI(question, getContextMessages());
        const botMsg = buildBotMsg(answer);
        messageHistory.push(botMsg);
        io.emit("message", botMsg);
      } catch (err) {
        console.error("AI error:", err.message);
        const errMsg = buildBotMsg("⚠️ Couldn't reach AI. Check your Gemini API key.");
        messageHistory.push(errMsg);
        io.emit("message", errMsg);
      } finally {
        io.emit("bot_typing", false);
      }
    }
  });

  socket.on("summarize", async () => {
    io.emit("bot_typing", true);
    try {
      const summary = await summarizeChat(getContextMessages(50));
      const botMsg = buildBotMsg(`📋 **Chat Summary**\n\n${summary}`);
      messageHistory.push(botMsg);
      io.emit("message", botMsg);
    } catch (err) {
      console.error("Summarize error:", err.message);
      const errMsg = buildBotMsg("⚠️ Couldn't summarize. Check your Gemini API key.");
      messageHistory.push(errMsg);
      io.emit("message", errMsg);
    } finally {
      io.emit("bot_typing", false);
    }
  });

  socket.on("disconnect", () => {
    const username = activeUsers.get(socket.id);
    activeUsers.delete(socket.id);
    io.emit("users", Array.from(activeUsers.values()));
    if (username) {
      const sysMsg = buildBotMsg(`**${username}** left the chat`);
      messageHistory.push(sysMsg);
      io.emit("message", sysMsg);
    }
    console.log("Client disconnected:", socket.id);
  });
});

function buildBotMsg(text) {
  return {
    id: Date.now() + Math.random(),
    username: "NexusBot",
    text,
    timestamp: new Date().toISOString(),
    isBot: true,
  };
}

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on :${PORT}`));