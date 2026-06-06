# Saarthi Mail

AI-powered intelligent email assistant built using React, Node.js, Gmail API, Google Calendar API, MongoDB, and Groq LLMs.

Saarthi Mail transforms a traditional inbox into an AI-assisted productivity workspace capable of:

* Smart email summarization
* Priority detection
* AI-generated replies
* Meeting extraction
* Google Calendar automation
* Gmail synchronization

---

# Features

## Authentication

* Google OAuth 2.0 login
* Session-based authentication using Passport.js

## Gmail Integration

* Fetch Gmail inbox emails
* Read full email content
* Sync emails into MongoDB

## AI Features

* AI email summaries
* Priority classification
* Suggested actions
* AI-generated professional replies
* Meeting detection from email content

## Google Calendar Automation

* Detect meetings from emails
* Create Google Calendar events automatically

## Frontend Experience

* Modern responsive UI
* AI insights side panel
* Priority inbox
* Smart reply workflow
* Loading states and polished animations

---

# Tech Stack

## Frontend

* React
* Vite
* TailwindCSS
* Framer Motion
* Lucide Icons

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js

## APIs & AI

* Gmail API
* Google Calendar API
* Google OAuth
* Groq LLM API

---

# High-Level Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │  (Saarthi Mail UI)  │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               │
                    ┌──────────▼──────────┐
                    │   Express Backend   │
                    │  REST API Server    │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         │                     │                     │
         ▼                     ▼                     ▼

┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│  Google OAuth  │   │   Gmail API    │   │ Calendar API   │
│ Authentication │   │ Fetch Emails   │   │ Create Events  │
└────────────────┘   └────────────────┘   └────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AI Processing     │
                    │  (Groq + LLMs)      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼

         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │ Summary  │   │ Priority │   │ Meetings │
         │ Engine   │   │ Engine   │   │ Detector │
         └──────────┘   └──────────┘   └──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │ Email Intelligence  │
                    └─────────────────────┘
```

---

# AI Workflow

```text
Gmail Email
     ↓
Fetch Full Email Content
     ↓
AI Processing Pipeline
     ↓
Summarization
Priority Detection
Meeting Extraction
Reply Generation
     ↓
Store Structured Data
     ↓
Frontend Smart Inbox
```

---

# Project Structure

## Frontend

```text
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
```

## Backend

```text
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── prompts/
│   ├── routes/
│   ├── services/
│   │   ├── ai/
│   │   ├── gmail/
│   │   └── google/
│   └── utils/
├── app.js
├── server.js
└── .env
```

---

# Environment Variables

## Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_uri

SESSION_SECRET=your_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GROQ_API_KEY=your_groq_api_key
```

---

# Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

# Backend Setup

```bash
cd server

npm install

npm run dev
```

---

# Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# Google Cloud Setup

Enable:

* Gmail API
* Google Calendar API

Configure:

* OAuth Consent Screen
* Test Users
* OAuth Credentials

Add redirect URI:

```text
http://localhost:5000/api/auth/google/callback
```

---

# Current AI Capabilities

## Email Intelligence

* Summarize emails
* Detect urgency
* Suggest next actions

## Smart Productivity

* Generate replies
* Detect meetings automatically
* Create Google Calendar events

## Intelligent Inbox

* Priority inbox
* AI insights panel
* Meeting badges

---

# Future Improvements

* Real-time email sync
* Background cron jobs
* Semantic search
* RAG-based memory
* Vector database integration
* AI task extraction
* Multi-user workspace
* Email categorization agents
* Notification system
* Deployment + production OAuth verification

---

# Demo Flow

```text
Login with Google
      ↓
Sync Gmail Inbox
      ↓
AI analyzes emails
      ↓
Priority emails highlighted
      ↓
Generate smart replies
      ↓
Detect meetings
      ↓
Create calendar events
```

---

# Why Saarthi Mail?

Traditional email clients are passive.

Saarthi Mail acts as an:

* AI productivity assistant
* intelligent inbox manager
* workflow automation system

It combines:

* AI reasoning
* email intelligence
* workflow automation
* productivity tooling

into one unified platform.

---

# License

MIT License
