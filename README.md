# Urumuri — Rwanda Christian Digital Ecosystem

A production-ready, Rwanda-focused Christian platform supporting multiple denominations. Built with NestJS, Prisma and PostgreSQL.

## 🚀 Quick Start (One Command)

```bash
# 1. Clone & enter project
cd backend

# 2. Copy environment variables
cp .env.example .env

# 3. Start PostgreSQL via Docker
docker-compose up -d

# 4. Install dependencies
npm install

# 5. Run migrations & seed
npx prisma migrate dev
npm run seed

# 6. Start the server
npm run start:dev
```

The API will be available at **http://localhost:3000/api/v1** and Swagger docs at **http://localhost:3000/api/docs**.

---

## 📐 Architecture

```
Organization (Denomination)
  └── Church (Parish/Branch)
        ├── Sermons
        ├── Events
        └── Announcements

Users Roles: USER | CHURCH_ADMIN | TEACHER | MODERATOR | SUPER_ADMIN
```

## 📦 Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Framework   | NestJS (modular)          |
| ORM         | Prisma v5                 |
| Database    | PostgreSQL 15             |
| Auth        | JWT (access tokens)       |
| Validation  | class-validator           |
| API Docs    | Swagger / OpenAPI         |
| Infra       | Docker Compose            |

## 🗂 Module Structure

```
src/modules/
├── auth/           — JWT login, register, RBAC guards
├── users/          — user profile management
├── organizations/  — Christian org directory (Super Admin)
├── churches/       — church CRUD & verification
├── sermons/        — sermon content management
├── events/         — church events
├── announcements/  — church announcements
├── devotions/      — daily devotions with scheduling
├── academy/        — Bible courses, lessons, quizzes, enrollment
├── community/      — posts, comments, reactions
├── moderation/     — reports & moderation actions
├── notifications/  — in-app notifications
├── audit/          — audit logs (global service)
└── prisma/         — Prisma client (global service)
```

## 🔑 Default Seed Credentials

| Role         | Email                    | Password     |
|--------------|--------------------------|--------------|
| SUPER_ADMIN  | superadmin@urumuri.rw    | password123  |
| CHURCH_ADMIN | admin1@church.rw         | password123  |
| CHURCH_ADMIN | admin2@church.rw         | password123  |
| TEACHER      | teacher@academy.rw       | password123  |
| USER         | user1@urumuri.rw         | password123  |

> ⚠️ Change all passwords before deploying to production.

## 🗄 Database

```bash
# Open Prisma Studio (visual DB browser)
npx prisma studio

# Create a new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Reset database and re-seed
npx prisma migrate reset
npm run seed
```

## 🧪 Testing

```bash
npm run test           # unit tests
npm run test:cov       # coverage report
npm run test:e2e       # end-to-end tests
```

## 📖 API Documentation

Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

All protected endpoints require a Bearer JWT token. Use the `/api/v1/auth/login` endpoint to obtain a token.

## 🔐 Authentication Flow

```
POST /api/v1/auth/register  — create account
POST /api/v1/auth/login     — get JWT token
GET  /api/v1/auth/profile   — view own profile (requires auth)
```

## 🏗 Key API Endpoints

| Resource          | Base Route                       |
|-------------------|----------------------------------|
| Organizations     | /api/v1/organizations            |
| Churches          | /api/v1/churches                 |
| Sermons           | /api/v1/sermons                  |
| Events            | /api/v1/events                   |
| Announcements     | /api/v1/announcements            |
| Devotions         | /api/v1/devotions                |
| Academy Courses   | /api/v1/academy/courses          |
| Community Posts   | /api/v1/community/posts          |
| Reports           | /api/v1/moderation/report        |
| Notifications     | /api/v1/notifications            |

## 🌍 Environment Variables

See [`.env.example`](.env.example) for all configuration options.

## 📋 Assumptions & Decisions

- Media uploads use **external URLs** (YouTube, SoundCloud, etc.) — no file upload server required for MVP.
- Certificates have a unique `certificateCode` (UUID) for QR verification — PDF generation is a stub (URL-based).
- `serviceTimes` stored as **JSON** (e.g. `{"sunday": "9:00 AM", "wednesday": "6:00 PM"}`).
- Rate limiting and email service are **stubbed** — structure is ready for production wiring.
- Languages: `EN` (English) and `RW` (Kinyarwanda) supported per content item.
