# URUMURI REGIO - Catholic Youth & Legion Management Platform

**Production-Ready Backend - Rwanda Catholic Church**

## Project Overview

URUMURI REGIO is a comprehensive Catholic youth engagement and Legion of Mary governance platform designed specifically for the Catholic Church in Rwanda. The system digitizes community management, increases youth participation, and provides structured spiritual formation.

## Target Users

- Legion of Mary (Praesidium → Curia → Comitium → Regio → Senatus)
- Catholic Youth Communities
- Catholic Charismatic Renewal
- Catholic Action Groups
- Church Choirs
- Small Christian Communities (SCC)

## Core Problems Solved

1. ✅ Low youth participation
2. ✅ Schedule clashes between groups
3. ✅ WhatsApp noise and misinformation
4. ✅ Weak follow-up for absent members
5. ✅ Manual record keeping
6. ✅ Leadership overload
7. ✅ Weak structured formation
8. ✅ Safeguarding risks

## Technology Stack

### Backend (✅ COMPLETE)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT with refresh tokens
- **API Docs**: Swagger/OpenAPI
- **Scheduling**: CRON jobs (@nestjs/schedule)
- **Validation**: class-validator + class-transformer

### Frontend (🚧 PENDING)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl (en/rw/fr)
- **PWA**: Service Worker + Manifest
- **State**: React Context/Zustand

## Backend Architecture

### Modules Implemented

| Module | Status | Description |
|--------|--------|-------------|
| Auth | ✅ | JWT authentication, RBAC, guards |
| Groups | ✅ | Community management, join requests |
| Meetings | ✅ | QR check-in, attendance tracking |
| Devotions | ✅ | Daily generation (5AM CRON) |
| Formation | ✅ | Lessons, quizzes, badges |
| Messaging | ✅ | Threads, DMs, rate limiting |
| Events | ✅ | Calendar, conflict detection |
| Announcements | ✅ | Parish/group notifications |
| Users | ✅ | Profile management |
| Audit | ✅ | Compliance logging |

### Database Schema

**27 Models** including:
- User, Diocese, Church
- CouncilHierarchy (Legion structure)
- Group, Membership
- Meeting, Attendance
- Devotion, FormationLesson, Quiz
- Badge, UserBadge
- Event, Announcement
- ConversationThread, Message, DirectMessage
- AuditLog, MessageReport

### API Endpoints

**60+ endpoints** across 10 modules:
- Authentication (register, login, refresh)
- Groups (CRUD, join, members)
- Meetings (schedule, check-in, attendance)
- Devotions (today, recent, by date)
- Formation (lessons, quizzes, progress, badges)
- Messaging (threads, messages, DMs, reports)
- Events (calendar, conflicts)
- Announcements (parish, group)
- Users (profile, settings)
- Admin (dashboard, moderation)

### Security Features

- ✅ JWT access + refresh tokens
- ✅ 9-tier role-based access control
- ✅ Rate limiting (10 messages/minute)
- ✅ Message reporting & moderation
- ✅ Audit logging for compliance
- ✅ Hierarchy-based data visibility
- ✅ Input validation on all endpoints

### CRON Jobs

1. **Daily Devotion Generator** - 5:00 AM Africa/Kigali
   - Auto-generates multilingual devotional content
   - Stores for offline access (7-day cache)

2. **Absence Alert Checker** - 8:00 AM Africa/Kigali
   - Detects 2+ missed meetings
   - Creates follow-up tasks for leaders

### Multilingual Support

All content in 3 languages:
- **English** (en) - Primary
- **Kinyarwanda** (rw) - Local
- **French** (fr) - Official

Fields: `title_en`, `title_rw`, `title_fr`, `content_en`, etc.

## Roles & Permissions

1. **YOUTH_USER** - Basic member access
2. **GROUP_MEMBER** - Active participant
3. **GROUP_LEADER** - Group management
4. **SECRETARY** - Minutes, records
5. **TREASURER** - Financial tracking
6. **PARISH_ADMIN** - Parish-level admin
7. **COUNCIL_ADMIN** - Curia/Comitium/Regio
8. **MODERATOR** - Content moderation
9. **SUPER_ADMIN** - System administration

## Demo Data (Seed)

- 1 Diocese (Kigali)
- 3 Parishes (Kimironko, Remera, Nyamirambo)
- 1 Senatus, 1 Regio, 2 Comitiums, 3 Curias, 3 Praesidia
- 6 Groups (various types)
- 4 Test users with roles
- 7 Days of devotions
- 2 Formation lessons + quizzes
- 3 Badges

### Test Credentials

```
Admin:  admin@urumuri.rw / password123
Leader: leader@urumuri.rw / password123
Youth:  marie@urumuri.rw / password123
Youth:  patrick@urumuri.rw / password123
```

## Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start server
npm run start:dev
```

API Documentation: http://localhost:3001/api

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
Religion/
├── backend/                    # NestJS API (✅ COMPLETE)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── groups/        # Community management
│   │   │   ├── meetings/      # Attendance tracking
│   │   │   ├── devotions/     # Daily devotions
│   │   │   ├── formation/     # Lessons & quizzes
│   │   │   ├── messaging/     # Communication
│   │   │   ├── events/        # Calendar
│   │   │   ├── announcements/ # Notifications
│   │   │   ├── users/         # Profiles
│   │   │   └── audit/         # Logging
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed-urumuri.ts    # Demo data
│   │   └── migrations/
│   └── package.json
├── frontend/                   # Next.js PWA (🚧 PENDING)
├── docker-compose.yml
├── IMPLEMENTATION_STATUS.md
└── README.md
```

## Next Steps

### Frontend Development

1. Initialize Next.js 14 with App Router
2. Setup Tailwind CSS + shadcn/ui
3. Implement next-intl for i18n
4. Create PWA configuration
5. Build authentication flow
6. Implement core pages:
   - Home (Devotion + Events)
   - Groups (Browse + My Groups)
   - Meetings (Schedule + Check-in)
   - Formation (Lessons + Quizzes)
   - Messaging (Threads + DMs)
   - Calendar (Parish events)
   - Profile (Settings + Badges)
7. Add offline support
8. Optimize for low-bandwidth

### Deployment

1. Setup production environment
2. Configure PostgreSQL
3. Deploy backend (Docker/VPS)
4. Deploy frontend (Vercel/Netlify)
5. Setup domain + SSL
6. Configure CORS
7. Enable monitoring

## Features Highlights

### Youth Engagement
- Gamification (badges, streaks)
- Formation hub (micro-lessons)
- Progress tracking
- Mentor assignment

### Legion Bookwork
- Digital membership register
- Meeting minutes templates
- Work/visitation reports
- Treasury tracking
- Quarterly report generator

### Structured Communication
- Thread-based discussions
- Required categories
- Rate limiting
- Moderation tools
- Safeguarding compliance

### Parish Coordination
- Shared calendar
- Conflict detection
- Event approval workflow
- Multi-group visibility

## Assumptions Made

1. JWT-based authentication (no OAuth initially)
2. Local file storage (can upgrade to S3)
3. Manual devotion generation (can integrate Catholic Calendar API)
4. In-app notifications only (can add push later)
5. No payment processing (treasury tracking only)
6. No email/SMS (can add later)

## Performance Considerations

- Mobile-first design
- Low-bandwidth optimization
- Offline-first PWA
- Image optimization
- API response caching
- Database indexing
- Rate limiting

## Compliance & Safeguarding

- No anonymous messaging
- All DMs logged in audit trail
- Message reporting system
- Role-based content visibility
- Quiet hours enforcement
- Spam protection
- Full moderation panel

## Support & Maintenance

- Comprehensive API documentation (Swagger)
- Seed scripts for testing
- Migration system for schema updates
- Audit logs for debugging
- Error handling & logging
- Health check endpoints

## License

Proprietary - Catholic Church Rwanda

## Contact

Development Team: URUMURI REGIO Project

---

**Status**: Backend Complete ✅ | Frontend Pending 🚧
**Last Updated**: March 3, 2026
**Version**: 1.0.0-backend
