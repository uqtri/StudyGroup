# 📚 StudyHub — Group Study Management System

## 📖 Project Description

StudyHub is a full-stack web application for organizing and running collaborative study groups. Students and group leaders can discover groups, request membership, schedule study sessions, track attendance, share resources in folders, and participate in group discussions with voting and mentions. Platform administrators manage users, groups, sessions, resources, and moderation reports through a separate admin portal.

**Target users:** students (members), study group leaders, and platform administrators.

**Business objectives:** centralize group coordination, improve session accountability through attendance tracking, enable knowledge sharing via structured resources, and provide admins with oversight and moderation tools.

**Key capabilities:** role-based access (ADMIN, LEADER, MEMBER), JWT authentication with refresh tokens, real-time video meetings via LiveKit, file uploads via Cloudinary, in-app notifications, and role-specific dashboard analytics.

---

## ✨ Features

### 🔐 Authentication
- User registration (default MEMBER role)
- Login with access and refresh tokens
- Profile retrieval (`GET /auth/me`)
- Token refresh (body or HTTP-only cookie)
- Logout (refresh token invalidation)
- Account status checks (ACTIVE, INACTIVE, SUSPENDED)

### 👤 User Management
- View and update own profile
- Admin: list users with pagination
- Admin: update user status (ACTIVE / INACTIVE / SUSPENDED)
- Admin: soft-delete users

### 👥 Study Groups
- Browse groups (public listing with optional auth)
- Create, update, and soft-delete groups
- Join requests (request, cancel, approve, reject)
- Group member roles (LEADER, MEMBER)
- Admin: set group status (ACTIVE, ARCHIVED, DELETED)
- Group management UI for leaders (members, join requests)

### 📅 Study Sessions
- List and view sessions (optional auth for public browse)
- Create, update, end, and delete sessions
- Session statuses: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- Notify group members about a session
- LiveKit access token for in-browser meetings (`GET /sessions/:id/livekit-token`)

### ✅ Attendance
- Mark attendance (PRESENT, ABSENT, LATE, EXCUSED)
- Record session join timestamp
- List attendance by session
- Per-user attendance statistics on dashboards

### 📁 Resources
- Resource folders per group (create, list, update)
- Upload resources (title, file URL, type) into folders
- Star ratings (toggle per user)
- Soft-delete resources
- Cloudinary signed upload support

### 💬 Discussions
- Group posts with title, content, and file attachments
- Upvote/downvote on posts
- Threaded comments with replies
- Comment mentions (@user) for group members
- Upvote/downvote on comments
- Edit and soft-delete (author-owned content)

### 🔔 Notifications
- In-app notification list
- Unread count
- Mark single or all notifications as read

### 🛡️ Moderation & Reports
- Submit reports (USER, GROUP, POST, COMMENT, RESOURCE)
- Admin: list and update report status (PENDING, REVIEWED, RESOLVED, DISMISSED)

### 📊 Dashboard & Analytics
- Role-based stats for MEMBER, LEADER, and ADMIN
- Admin: per-group statistics
- Charts on admin dashboard (Recharts)

### ⚙️ Administration (Web UI)
- Admin portal at `/admin/*` (separate layout from student site)
- Dashboard, users, groups, sessions, resources, settings pages

### 🌐 Public Website
- Landing page, FAQ, contact, terms, and privacy pages
- Dark/light theme toggle

---

## 🛠️ Tech Stack

### ⚛️ Frontend
- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4
- Axios
- TanStack React Query
- Zustand
- React Hook Form + Zod
- Recharts
- LiveKit (`livekit-client`, `@livekit/components-react`)
- Lucide React
- Base UI / shadcn-style components

### 🖥️ Backend
- Node.js (ES modules)
- Express 4
- Prisma ORM 6
- PostgreSQL
- bcrypt (password hashing)
- jsonwebtoken (access + refresh tokens)
- express-validator
- Helmet, CORS, Morgan, cookie-parser
- Cloudinary SDK
- LiveKit Server SDK

### 🗄️ Database
- PostgreSQL (Neon cloud or local via Docker Compose)

### 🧪 Testing
- Vitest (service, utility, middleware unit tests)
- Jest (service, controller/API, E2E tests)
- Supertest (HTTP integration tests)

### 🐳 Deployment (infrastructure)
- Docker (multi-stage builds)
- Docker Compose (PostgreSQL, backend, frontend)
- Nginx (production frontend static hosting and `/api` proxy)

---

## 🏗️ Architecture

The project is a **monorepo** with a React SPA frontend and a modular Express API backend.

### 🔧 Backend (layered, feature-based modules)

Each API module follows a consistent structure:

- **Routes** — HTTP endpoints, validation chains, middleware
- **Controller** — request/response handling
- **Service** — business logic and authorization rules
- **Repository** — Prisma data access
- **Validation** — `express-validator` rules

Shared cross-cutting pieces live under `src/middlewares`, `src/config`, `src/utils`, and `src/constants`.

Patterns in use:

- **Modular / feature-based architecture** (one folder per domain: `auth`, `groups`, `sessions`, etc.)
- **MVC-style separation** (controller → service → repository)
- **RBAC** via `authenticate` and `authorize(ROLES.*)` middleware

### 🎨 Frontend

- **Page-based routing** with role guards (`StudentRoute`, `AdminRoute`, `GuestRoute`)
- **API client layer** (`src/api/*`) over Axios with automatic token refresh
- **State:** Zustand (auth, theme); React Query for server state

---

## 📂 Folder Structure

```text
StudyGroup/
├── backend/
│   ├── automation-tests/     # Vitest + Jest test suites
│   │   ├── jest/             # Service, controller, E2E tests
│   │   ├── vitest/             # Supplementary unit tests
│   │   ├── helpers/
│   │   ├── mocks/
│   │   └── docs/               # Test reports and traceability
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   │   ├── modules/            # Feature modules (auth, groups, …)
│   │   ├── middlewares/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API clients
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── schemas/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── scripts/                    # QA / decision-table generators
└── README.md
```

| Folder | Purpose |
|--------|---------|
| `backend/src/modules` | Domain modules (routes, controllers, services, repositories) |
| `backend/src/middlewares` | Authentication, authorization, error handling |
| `backend/src/config` | Environment and Prisma client setup |
| `backend/prisma` | Database schema, migrations, and seed data |
| `backend/automation-tests` | Automated API tests (Vitest + Jest + Supertest) |
| `frontend/src/pages` | Route-level UI pages (auth, groups, admin, sessions) |
| `frontend/src/api` | Typed HTTP clients for each backend module |
| `frontend/src/layouts` | Website, admin, auth, and dashboard shells |
| `scripts` | Decision-table and test-annotation tooling (QA artifacts) |

---

## 📦 Installation

### ✅ Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL (Neon, local install, or Docker)

### 📥 Clone and install

```bash
git clone <repository-url>
cd StudyGroup
```

**Backend:**

```bash
cd backend
cp .env.example .env
npm install
```

**Frontend:**

```bash
cd frontend
cp .env.example .env
npm install
```

---

## 🔑 Environment Variables

### ⚙️ Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `JWT_ACCESS_SECRET` | Access token signing secret (required, 32+ chars recommended) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret (required) |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL (default `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (default `7d`) |
| `CORS_ORIGIN` | Allowed frontend origin (default `http://localhost:5173`) |
| `LIVEKIT_API_KEY` | LiveKit API key (video meetings) |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `LIVEKIT_URL` | LiveKit WebSocket URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned/signed upload preset |

### 💻 Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default `http://localhost:5000/api`) |

Never commit `.env` files with real secrets.

---

## ▶️ Running the Project

### 🖥️ Backend (development)

```bash
cd backend
npm run dev
```

API: **http://localhost:5000**

### 💻 Frontend (development)

```bash
cd frontend
npm run dev
```

App: **http://localhost:5173**

### 📦 Frontend (production build)

```bash
cd frontend
npm run build
npm run preview
```

### 🚀 Backend (production)

```bash
cd backend
npm run db:migrate:deploy
npm start
```

---

## 🗃️ Database Setup

Generate the Prisma client:

```bash
cd backend
npm run db:generate
```

Apply migrations (development):

```bash
npm run db:migrate
```

Deploy migrations (production / Docker):

```bash
npm run db:migrate:deploy
```

Push schema without migration files (optional):

```bash
npm run db:push
```

Seed roles and demo data:

```bash
npm run db:seed
```

Open Prisma Studio:

```bash
npm run db:studio
```

Migrations live in `backend/prisma/migrations/`. The Docker backend image runs `prisma migrate deploy` on startup before starting the server.

### 🌱 Seed accounts

| Email | Password | Role |
|-------|----------|------|
| admin@studyhub.com | Password123! | ADMIN |
| leader@studyhub.com | Password123! | LEADER (+ MEMBER) |
| student@studyhub.com | Password123! | MEMBER |

Change these credentials before any production deployment.

---

## 🔌 Main APIs

Base URL: `http://localhost:5000/api`

| Module | Base path | Notes |
|--------|-----------|-------|
| Health | `GET /health` | Public health check |
| Auth | `/auth` | Register, login, me, refresh, logout |
| Users | `/users` | Profile; admin list/status/delete |
| Groups | `/groups` | CRUD, join requests, admin status |
| Sessions | `/sessions` | CRUD, end, notify, LiveKit token |
| Attendance | `/attendance` | Mark, join, list by session |
| Resource folders | `/resource-folders` | Folder CRUD |
| Resources | `/resources` | Resource CRUD, star rating |
| Posts | `/posts` | Discussions, votes |
| Comments | `/comments` | Threaded comments, votes |
| Notifications | `/notifications` | List, unread count, mark read |
| Reports | `/reports` | Create; admin list/update |
| Dashboard | `/dashboard` | Role stats; admin group stats |
| Upload | `/upload` | Cloudinary signature |

### 🔐 Auth endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Bearer |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Bearer |

### 📋 Response format

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

Protected routes require: `Authorization: Bearer <accessToken>`

---

## 🧪 Testing

Tests run from the `backend/` directory.

### ⚡ Vitest (default `npm test`)

```bash
cd backend
npm test
npm run test:watch
npm run test:cov:vitest
```

### 🎯 Jest (service, API/controller, E2E)

```bash
npm run test:jest
npm run test:service
npm run test:api
npm run test:e2e
npm run test:cov
```

### ✅ All tests

```bash
npm run test:all
```

Frameworks in use: **Vitest**, **Jest**, **Supertest**. No Cypress or Playwright suites are present.

See `backend/automation-tests/README.md` for layout and QA documentation references.

---

## 📜 Scripts

### 🖥️ Backend (`backend/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API with nodemon |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:migrate:deploy` | Deploy migrations (prod) |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed roles and demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | ESLint on `src/` |
| `npm run format` | Prettier format |
| `npm test` | Vitest (all vitest suites) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:all` | Vitest + Jest |
| `npm run test:jest` | Jest service + API + E2E |
| `npm run test:service` | Jest service unit tests |
| `npm run test:api` | Jest controller/API tests |
| `npm run test:e2e` | Jest E2E tests |
| `npm run test:cov` | Jest with coverage |
| `npm run test:cov:vitest` | Vitest with coverage |

### 💻 Frontend (`frontend/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint on `src/` |
| `npm run format` | Prettier format |

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| JWT access tokens | Short-lived; sent as `Authorization: Bearer` |
| Refresh tokens | Stored hashed in database; rotatable via `/auth/refresh` |
| Password hashing | bcrypt (cost factor 12) |
| RBAC | Platform roles ADMIN, LEADER, MEMBER via `authorize()` middleware |
| Group-level roles | LEADER / MEMBER on `GroupMember` |
| Input validation | `express-validator` on route inputs |
| HTTP hardening | Helmet security headers |
| CORS | Configurable origin with credentials |
| Cookie support | `cookie-parser` for optional refresh token transport |
| Account suspension | SUSPENDED users blocked at login |
| Soft deletes | Users, groups, sessions, posts, comments, resources |

Not implemented in the current backend: rate limiting, CSRF middleware, or dedicated permission tables beyond role names.

---

## 🚀 Deployment

### 🐳 Docker Compose (full stack)

```bash
docker compose up --build
```

Services:

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL 16 |
| `backend` | 5000 | Express API (runs migrations on start) |
| `frontend` | 5173 → 80 | Nginx serving Vite build; proxies `/api` to backend |

Database-only (for local dev with host-run API):

```bash
docker compose up -d postgres
```

Use `postgresql://studyhub:studyhub@localhost:5432/studyhub?sslmode=disable` in `backend/.env`.

### 📦 Docker images

- **Backend:** Node 20 Alpine; `prisma migrate deploy` then `node server.js`
- **Frontend:** Node build stage → Nginx Alpine serving SPA with API reverse proxy

### 🔄 CI/CD

No GitHub Actions or other CI pipeline configuration is present in this repository.

---

## 📄 License

This project is intended for educational and internal use.
