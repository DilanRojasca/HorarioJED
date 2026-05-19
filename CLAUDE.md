# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HorarioJED** is a student academic management portal ("Portal Estudiantil") for Universidad Católica Luis Amigó. Full-stack: React/TypeScript frontend (Vite) and Python FastAPI backend connected to Supabase.

---

## Commands

### Frontend (`/frontend`)

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run lint         # ESLint
```

### Backend (`/backend`)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload                # http://localhost:8000
uvicorn main:app --reload --port 8001    # Alternate port
```

FastAPI auto-docs: `http://localhost:8000/docs`

### Environment Variables

`/backend/.env`:

```
SUPABASE_URL=...
SUPABASE_KEY=...
JWT_SECRET=...
```

---

## Architecture

### Frontend Routes (`src/App.tsx`)

| Path                 | Component               | Guard                                         |
| -------------------- | ----------------------- | --------------------------------------------- |
| `/login`             | `Login`                 | Public                                        |
| `/register`          | `Register`              | Public                                        |
| `/dashboard`         | `Dashboard`             | `AuthRoute` (token in localStorage)           |
| `/admin/cursos`      | `PanelAdminCursos`      | `AdminRoute` (role==="admin" in localStorage) |
| `/admin/estudiantes` | `PanelAdminEstudiantes` | `AdminRoute`                                  |

- `AuthRoute`: redirects to `/login` if no `token` in localStorage
- `AdminRoute`: redirects to `/dashboard` if `role !== "admin"` in localStorage
- `localStorage` keys: `token`, `userName`, `role`

### Frontend Stack

- **Styling**: Tailwind CSS — primary `#00849a` (teal), secondary `#f58220` (orange), Lexend font via `font-display`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP**: Raw `fetch` to `http://localhost:8000` — no abstraction layer
- **Path alias**: `@/` → `src/`

### Backend (`/backend`)

```
main.py                         # FastAPI app + CORS + router registration
routes/
  auth.py                       # POST /auth/register, POST /auth/login
  horario.py                    # GET /horario/hoy|semana|dia/{dia}, POST /horario/seed-demo
  admin.py                      # GET /admin/students, GET /admin/courses
services/
  auth_service.py               # register_user, login_user
  horario_service.py            # get_horario_dia, get_horario_semana, seed_demo
models/
  user_model.py                 # UserRegister, UserLogin (Pydantic)
  horario_model.py              # ClaseModel, HuecoModel, UbicacionModel
database/supabase_client.py     # Supabase client singleton
utils/
  hash.py                       # bcrypt hashing/verification
  jwt_handler.py                # HS256 JWT (24h, payload: user_id + email)
```

### Auth Pattern (Backend)

Routes that require authentication extract the JWT manually — there is no global FastAPI dependency. Each route calls a local helper:

```python
def _get_user(authorization: str) -> str:
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    return payload["user_id"]
```

Admin routes use `_verify_admin()` which additionally queries Supabase to verify the user's role.

### Database (Supabase/PostgreSQL)

| Table        | Key Columns                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| `users`      | `id`, `full_name`, `cedula`, `email`, `password` (bcrypt), `role`                                          |
| `materias`   | `id`, `nombre`, `codigo`, `creditos`                                                                       |
| `profesores` | `id`, `nombre`                                                                                             |
| `horarios`   | `id`, `user_id`, `materia_id`, `profesor_id`, `dia_semana`, `hora_inicio`, `hora_fin`, `salon`, `semestre` |

`horarios` joins to `materias` and `profesores` via FK. `dia_semana` values: `lunes`, `martes`, `miercoles`, `jueves`, `viernes`, `sabado`.

### Horario Service Logic

`horario_service.py` is the core of the app:

- Queries `horarios` with nested joins to `materias` and `profesores`
- `_parse_salon()` parses salon strings like `"Bloque 1 - 302"` → structured `UbicacionModel` (bloque, piso, aula)
- `_calcular_huecos()` finds free gaps ≥ 30 min between consecutive classes and suggests activities
- `seed_demo()` inserts 14 hardcoded schedule rows (fixed UUIDs for materias/profesores) for a given `user_id`

### Dashboard (`src/pages/dashboard/Dashboard.tsx`)

Single-file component (~870 lines). On mount it fetches both `/horario/hoy` and `/horario/semana` in parallel. Key sub-components all defined in the same file:

- `ClaseCard` — shows a class with "next" / "finished" state detection
- `HuecoCard` — expandable free-gap card with activity suggestions
- `TimelineDay` — interleaves sorted classes and gaps into a vertical timeline
- `ClaseModal` — detail modal with structured location (bloque/piso/aula)

---

## Known Gaps

- CORS is fully open (`allow_origins=["*"]`) — tighten before production
- Admin role is only checked client-side via `localStorage.role`; the backend `_verify_admin` checks the JWT but not a `role` field in the token, only `user_id`, then re-queries the DB
- "Descargar Horario" and "Calendario Académico" quick-action buttons are not yet wired up
