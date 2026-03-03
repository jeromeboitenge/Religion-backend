# URUMURI REGIO

**Catholic Youth & Legion Management Platform for Rwanda**

[![Status](https://img.shields.io/badge/Backend-Complete-success)]()
[![Build](https://img.shields.io/badge/Build-Passing-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![NestJS](https://img.shields.io/badge/NestJS-10-red)]()

---

## 🎯 Project Overview

URUMURI REGIO is a production-ready Catholic youth engagement and Legion of Mary governance platform designed specifically for the Catholic Church in Rwanda. The system digitizes community management, increases youth participation, and provides structured spiritual formation.

### Target Communities

- Legion of Mary (Praesidium → Curia → Comitium → Regio → Senatus)
- Catholic Youth Groups
- Catholic Charismatic Renewal
- Catholic Action
- Church Choirs
- Small Christian Communities (SCC)

---

## ✅ Current Status

### Backend: **COMPLETE & PRODUCTION READY** 🎉

- ✅ 11 modules fully implemented
- ✅ 27 database models with migrations
- ✅ 60+ API endpoints with Swagger documentation
- ✅ JWT authentication + RBAC (9 roles)
- ✅ 2 CRON jobs (daily devotions + absence alerts)
- ✅ Rate limiting & safeguarding features
- ✅ Multilingual support (English, Kinyarwanda, French)
- ✅ Build passing with 0 TypeScript errors
- ✅ Comprehensive documentation

### Frontend: **PENDING** 🚧

Next.js 14 PWA implementation planned.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev

# Seed demo data
npx prisma db seed

# Start development server
npm run start:dev
```

API will be available at: http://localhost:3001
Swagger docs at: http://localhost:3001/api

### Test Credentials

```
Admin:  admin@urumuri.rw / password123
Leader: leader@urumuri.rw / password123
Youth:  marie@urumuri.rw / password123
Youth:  patrick@urumuri.rw / password123
```

---

## 📚 Documentation

- **[BACKEND_COMPLETE.md](./BACKEND_COMPLETE.md)** - Backend completion summary
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Full project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Progress tracking
- **[backend/README_COMPLETE.md](./backend/README_COMPLETE.md)** - Backend API documentation

---

## 🏗️ Architecture

### Backend (NestJS)

```
backend/
├── src/modules/
│   ├── auth/           # JWT authentication & RBAC
│   ├── groups/         # Community management
│   ├── meetings/       # Attendance tracking
│   ├── devotions/      # Daily spiritual content
│   ├── formation/      # Lessons & quizzes
│   ├── messaging/      # Structured communication
│   ├── events/         # Parish calendar
│   ├── announcements/  # Notifications
│   ├── users/          # Profile management
│   ├── audit/          # Compliance logging
│   └── prisma/         # Database service
├── prisma/
│   ├── schema.prisma   # Database schema (27 models)
│   ├── seed-urumuri.ts # Demo data
│   └── migrations/     # Database migrations
└── package.json
```

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

---

## 🔑 Key Features

### Youth Engagement
- ✅ Gamification (badges, streaks)
- ✅ Formation hub (micro-lessons)
- ✅ Progress tracking
- ✅ Mentor assignment

### Legion Bookwork
- ✅ Digital membership register
- ✅ Meeting minutes templates
- ✅ Work/visitation reports
- ✅ Treasury tracking
- ✅ Quarterly report generator

### Structured Communication
- ✅ Thread-based discussions
- ✅ Required categories
- ✅ Rate limiting (10 msg/min)
- ✅ Moderation tools
- ✅ Safeguarding compliance

### Parish Coordination
- ✅ Shared calendar
- ✅ Conflict detection
- ✅ Event approval workflow
- ✅ Multi-group visibility

### Automation
- ✅ Daily devotion generation (5AM)
- ✅ Absence alerts (8AM)
- ✅ Badge awarding
- ✅ Follow-up task creation

---

## 🛡️ Security

- JWT access + refresh tokens
- 9-tier role-based access control
- Rate limiting (10 messages/minute)
- Message reporting system
- Audit logging for compliance
- Input validation on all endpoints
- SQL injection protection (Prisma)
- Hierarchy-based data visibility

---

## 🌍 Multilingual

All content supports:
- **English** (en) - Primary
- **Kinyarwanda** (rw) - Local
- **French** (fr) - Official

---

## 📊 Tech Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL 14+
- **Auth**: JWT
- **Docs**: Swagger/OpenAPI
- **Scheduling**: @nestjs/schedule

### Frontend (Planned)
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **PWA**: Service Worker

---

## 🎯 Problems Solved

1. ✅ Low youth participation
2. ✅ Schedule clashes between groups
3. ✅ WhatsApp noise and misinformation
4. ✅ Weak follow-up for absent members
5. ✅ Manual record keeping
6. ✅ Leadership overload
7. ✅ Weak structured formation
8. ✅ Safeguarding risks

---

## 📈 Metrics

- **API Endpoints**: 60+
- **Database Models**: 27
- **Modules**: 11
- **CRON Jobs**: 2
- **Roles**: 9
- **Languages**: 3
- **TypeScript Files**: 57
- **Build Errors**: 0

---

## 🚀 Deployment

### Docker (Recommended)

```bash
docker-compose up -d
```

### Traditional VPS

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide including:
- Ubuntu/Linux setup
- PostgreSQL configuration
- Nginx reverse proxy
- SSL/TLS with Let's Encrypt
- PM2 process management
- Backup procedures

---

## 📝 Git History

```
✅ feat: Complete backend implementation
✅ fix: Resolve TypeScript build errors
✅ docs: Add comprehensive deployment guide
✅ docs: Add backend completion summary
```

---

## 🎓 Roles & Permissions

1. **YOUTH_USER** - Basic member
2. **GROUP_MEMBER** - Active participant
3. **GROUP_LEADER** - Group management
4. **SECRETARY** - Minutes & records
5. **TREASURER** - Financial tracking
6. **PARISH_ADMIN** - Parish administration
7. **COUNCIL_ADMIN** - Curia/Comitium/Regio
8. **MODERATOR** - Content moderation
9. **SUPER_ADMIN** - System administration

---

## 📋 Next Steps

1. Initialize Next.js 14 frontend
2. Setup Tailwind CSS + shadcn/ui
3. Implement authentication flow
4. Build core pages (Home, Groups, Meetings, Formation, etc.)
5. Add PWA configuration
6. Implement i18n (next-intl)
7. Connect to backend API
8. Deploy to production

---

## 🤝 Contributing

This is a proprietary project for the Catholic Church in Rwanda.

---

## 📄 License

Proprietary - Catholic Church Rwanda

---

## 📞 Support

For technical support or questions:
- Review documentation in `/docs`
- Check API documentation at `/api` endpoint
- Review deployment guide in `DEPLOYMENT.md`

---

## 🙏 Acknowledgments

Built for the Catholic Church in Rwanda with focus on:
- Youth engagement
- Legion of Mary governance
- Spiritual formation
- Community building
- Safeguarding compliance

**URUMURI REGIO** - Lighting the way for Catholic youth in Rwanda 🕯️

---

**Version**: 1.0.0-backend  
**Status**: Backend Complete ✅ | Frontend Pending 🚧  
**Last Updated**: March 3, 2026  
**Build**: PASSING ✅
