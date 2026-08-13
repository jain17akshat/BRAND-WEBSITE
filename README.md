# Shraviko Sacred Living — Modular Workspace

This workspace has been restructured into standalone **`frontend`** and **`backend`** directories.

---

## Directory Layout

```
.
├── frontend/             # Vite + React 18 + TailwindCSS Client App
│   ├── public/           # Static Brand Assets & Images
│   ├── src/
│   │   ├── components/   # Modular UI Components (28 components)
│   │   ├── data/         # Catalog Products & Category Definitions
│   │   ├── services/     # API Client Service Layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Node.js + Express REST API Server
│   ├── config.js         # Port, Environment & Provider Configs
│   ├── index.js          # Express Server Setup & Route Mounting
│   ├── middleware/       # Custom Middleware (Rate Limiter, Error Handler, etc.)
│   ├── routes/           # API Endpoints (/api/orders, /api/payments, etc.)
│   ├── shiprocket/       # Shiprocket Logistics Integration & Auth
│   ├── razorpay/         # Razorpay Payment Verification & Order Generation
│   ├── mock/             # Fallback In-Memory Datastores
│   ├── .env
│   └── package.json
│
├── package.json          # Root Workspace Scripts
└── README.md
```

---

## First-Time Setup & Running

### 1. Install Dependencies
Run npm install in both subfolders (only needed once):

```bash
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 2. Run Both Services Concurrently
From the project root (`e:\Brand website`):

```bash
npm run dev
```

### 3. Run Services Separately (Optional)
```bash
# Frontend only (http://localhost:3000)
npm run dev:frontend

# Backend only (http://localhost:4000)
npm run dev:backend
```
