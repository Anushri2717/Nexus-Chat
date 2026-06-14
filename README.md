# Nexus Chat 💬

A real-time AI chat application with a premium dark UI, powered by Socket.io for live messaging and integrated with Claude/Gemini APIs for AI responses.

## 🚀 Features
- Real-time messaging with Socket.io
- AI-powered chat responses (Claude/Gemini API)
- Premium dark UI theme
- User authentication

## 🛠️ Tech Stack
React (Vite), Node.js, Express, Socket.io, Claude/Gemini API

## 📸 Screenshots

<table>
<tr>
<td align="center"><b>Chat Interface</b></td>
<td align="center"><b>AI Conversation</b></td>
</tr>
<tr>
<td><img src="./screenshots/chat.png" width="400"/></td>
<td><img src="./screenshots/aiconvo.png" width="400"/></td>
</tr>
</table>

## ⚙️ Setup Instructions

1. Clone the repository
```bash
git clone <your-repo-link>
cd nexus-chat
```

2. Install dependencies (frontend & backend)
```bash
cd client && npm install
cd ../server && npm install
```

3. Set up environment variables in `server/.env`
ANTHROPIC_API_KEY=your_api_key

GEMINI_API_KEY=your_api_key

JWT_SECRET=your_jwt_secret

PORT=5000

**
4. Run the app
```bash
# Backend
npm run dev

# Frontend (new terminal)
cd client && npm run dev
```

## 🌐 Live Demo
[View Live Demo](#)

## 👤 Author
Anushri — [Anushri2717](#) 

