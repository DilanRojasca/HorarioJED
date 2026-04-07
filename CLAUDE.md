# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HorarioJED** is a student academic management portal ("Portal Estudiantil") for Universidad Católica Luis Amigó. It is a full-stack app: a React/TypeScript frontend (Vite) and a Python FastAPI backend connected to Supabase.

---

## Commands

### Frontend (`/frontend`)

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Backend (`/backend`)

```bash
cd backend
pip install -r requirements.txt          # Install Python dependencies
uvicorn main:app --reload                # Start dev server (http://localhost:8000)
uvicorn main:app --reload --port 8001    # Use alternate port if needed
```

### Environment Variables

Backend requires a `.env` file in `/backend/`:
```
SUPABASE_URL=...
SUPABASE_KEY=...
JWT_SECRET=...
```

---

## Architecture

### Frontend

- **Router**: React Router v6, routes defined in `src/App.tsx`
  - `/login` → Login page, `/register` → Register, `/dashboard` → Dashboard
  - Root `/` redirects to `/login`; unknown routes show 404
- **Pages**: Each page is a self-contained component under `src/pages/`
- **HTTP**: Raw `fetch` calls to `http://localhost:8000`; no Axios or API abstraction layer
- **Auth state**: Token stored in `localStorage` under key `"token"`, username under `"userName"`
- **Styling**: Tailwind CSS with custom theme (`#00849a` primary teal, `#f58220` secondary orange, Lexend font). Dark mode via `class` strategy.
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Path alias**: `@/` maps to `src/`

### Backend

```
backend/
├── main.py              # FastAPI app, CORS middleware, router registration
├── routes/auth.py       # HTTP endpoints: POST /auth/register, POST /auth/login
├── services/auth_service.py  # Business logic: register_user, login_user
├── models/user_model.py # Pydantic schemas: UserRegister, UserLogin
├── database/supabase_client.py  # Supabase client (reads SUPABASE_URL, SUPABASE_KEY)
└── utils/
    ├── hash.py          # bcrypt password hashing/verification
    └── jwt_handler.py   # HS256 JWT creation (24h expiry, payload: user_id + email)
```

### Database (Supabase/PostgreSQL)

`users` table columns: `id`, `full_name`, `cedula` (Colombian national ID), `email`, `password` (bcrypt hash).

### Auth Flow

1. Register: `POST /auth/register` → bcrypt hash password → insert into Supabase `users`
2. Login: `POST /auth/login` → lookup by email → verify bcrypt → return HS256 JWT
3. Frontend stores JWT in `localStorage`; dashboard currently uses hardcoded mock data (no token-gated API calls yet)

---

## Current State / Known Gaps

- Dashboard schedule data is hardcoded mock data — not yet fetched from the backend
- No route guards on the frontend (dashboard accessible without a valid token)
- No JWT verification middleware on backend protected routes
- CORS is fully open (`allow_origins=["*"]`) — restrict before production
