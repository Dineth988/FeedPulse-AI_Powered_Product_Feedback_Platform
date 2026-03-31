# FeedPulse — AI-Powered Product Feedback Platform

> An internal tool that lets teams collect product feedback and feature requests, then uses **Google Gemini AI** to automatically categorise, prioritise, and summarise them — giving product teams instant clarity on what to build next.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router, React Server Components) |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Language | TypeScript (frontend + backend) |
| Database | MongoDB + Mongoose |
| AI | Google Gemini API (`gemini-1.5-flash`) via Google AI Studio |
| Auth | JWT-based admin authentication |

---

## Project Structure

```
FeedPulse/
├── frontend/                   ← Next.js 14 App
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx              ← Public feedback submission form
│   │       ├── dashboard/
│   │       │   └── page.tsx          ← Admin dashboard (protected)
│   │       └── layout.tsx
│   │   └── components/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── backend/                    ← Node.js + Express API
│   ├── src/
│   │   ├── index.ts                  ← Entry point
│   │   ├── routes/
│   │   │   ├── feedback.ts
│   │   │   └── auth.ts
│   │   ├── controllers/
│   │   │   ├── feedbackController.ts
│   │   │   └── authController.ts
│   │   ├── models/
│   │   │   └── Feedback.ts           ← Mongoose schema
│   │   ├── services/
│   │   │   └── gemini.service.ts     ← AI integration
│   │   ├── middleware/
│   │   │   └── auth.ts               ← JWT middleware
│   │   └── db/
│   │       └── connect.ts
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## How to Run Locally

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier) — or local MongoDB

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/feedpulse.git
cd feedpulse
```

---

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```bash
# backend/.env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/feedpulse
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

Backend runs at `http://localhost:3001`

---

### Step 3 — Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

### Step 4 — Open the app

| URL | Page |
|---|---|
| `http://localhost:3000` | Public feedback submission form |
| `http://localhost:3000/dashboard` | Admin dashboard (login required) |

---

## License

MIT
