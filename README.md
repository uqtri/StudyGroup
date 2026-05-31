# StudyHub - Group Study Management System

Production-ready monorepo for managing study groups, sessions, attendance, resources, and platform administration.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, React Router, TailwindCSS, Axios, React Hook Form, Zod, TanStack Query, Zustand, Lucide, Recharts |
| Backend | Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt, Helmet, CORS, Morgan, express-validator |
| Database | PostgreSQL (Neon or local via Docker) |

## Project Structure

```text
studyhub/
├── frontend/          # React SPA
├── backend/           # Express API + Prisma
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL (Neon cloud or Docker)

## Quick Start

### 1. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

API runs at **http://localhost:5000**

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:5173**

### 3. Docker (optional)

```bash
docker compose up -d postgres
# Use local DATABASE_URL in backend/.env:
# postgresql://studyhub:studyhub@localhost:5432/studyhub?sslmode=disable
```

Full stack:

```bash
docker compose up --build
```

## Seed Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@studyhub.com | Password123! | ADMIN |
| leader@studyhub.com | Password123! | LEADER |
| student@studyhub.com | Password123! | MEMBER |

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` — Register
- `POST /auth/login` — Login
- `GET /auth/me` — Profile (Bearer token)
- `POST /auth/refresh` — Refresh tokens
- `POST /auth/logout` — Logout

### Resources
- `GET/POST /groups` — Study groups
- `GET/POST /sessions` — Study sessions
- `GET/POST /resources` — Shared files/links
- `GET /dashboard/stats` — Role-based dashboard data
- `GET /users` — Admin user list
- `GET/PATCH /reports` — Reports (admin)

All protected routes require: `Authorization: Bearer <accessToken>`

### Response format

```json
{ "success": true, "message": "...", "data": {} }
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| PORT | API port (default 5000) |
| JWT_ACCESS_SECRET | Access token secret (32+ chars) |
| JWT_REFRESH_SECRET | Refresh token secret (32+ chars) |
| CORS_ORIGIN | Frontend URL |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name (resource uploads) |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | API base URL (default http://localhost:5000/api) |

## Scripts

### Backend
- `npm run dev` — Development server with watch
- `npm run db:migrate` — Run Prisma migrations
- `npm run db:seed` — Seed roles and demo data
- `npm run db:studio` — Prisma Studio GUI

### Frontend
- `npm run dev` — Vite dev server
- `npm run build` — Production build

## Security Notes

- Never commit `.env` files with real credentials
- Rotate JWT secrets in production
- Use Neon connection pooling for serverless deployments
- Change all seed passwords before going live

## License

MIT
