# PESquad — PES University SIH Teammate Platform

PESquad is a modern teammate matchmaking and hackathon collaboration platform built exclusively for PES University students participating in Smart India Hackathon (SIH) 2026.

## 🚀 Features

- **PESU OAuth2 Authentication**: Transparent OAuth 2.0 PKCE authentication via [`Vision2822/pesu-oauth2`](https://github.com/Vision2822/pesu-oauth2) with PESU credentials and granular student profile consent.
- **Encrypted Session Persistence**: High-security encrypted session management with `iron-session` cookies.
- **Student Hacker Discovery**: Filter peers by branch, semester, technical domains (Full Stack, AI/ML, Cloud, Web3, IoT), and hackathon experience.
- **Squad Formation & Invites**: Direct team invitations with contact handshakes and status tracking.
- **Real-Time SIH Countdown**: Live countdown timer configured for Smart India Hackathon internal and central submission deadlines.
- **Community Feed & Dynamic Hashtags**: Post squad requests (#LookingForTeam, #SIH2026, #IoT) with threaded comments and likes.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend API**: Express REST API with input validation and session middleware
- **Session Layer**: `iron-session` sealed cookies
- **Identity Provider**: `Vision2822/pesu-oauth2` (PESU OAuth 2.0 with PKCE)
- **Deployment**: Vercel & Supabase

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ST490/pesquad.git
cd pesquad

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

## 🔐 Environment Variables

| Variable | Description |
| :--- | :--- |
| `PORT` | Local server port (Default: 3000) |
| `PESU_AUTH_URL` | PESU Academy Auth API (Default: `https://pesu-auth.onrender.com`) |
| `SESSION_PASSWORD` | Encrypted session secret (min 32 characters) |
| `SIH_REGISTRATION_DEADLINE` | SIH Registration Deadline timestamp (ISO 8601) |
| `VITE_API_URL` | API base URL proxy prefix (Default: `/api`) |
