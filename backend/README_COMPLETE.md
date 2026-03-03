# URUMURI REGIO Backend

Catholic Youth & Legion Management Platform - Backend API

Rwanda-focused Catholic community management system with Legion of Mary governance, youth engagement, formation, and structured communication.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (Access + Refresh tokens)
- **Documentation**: Swagger/OpenAPI
- **Scheduling**: @nestjs/schedule (CRON jobs)
- **Validation**: class-validator

## Features

### Core Modules

1. **Auth Module** - JWT authentication, role-based access control
2. **Groups Module** - Catholic community management (Praesidia, Charismatic, Choirs, etc.)
3. **Meetings Module** - QR check-in, attendance tracking, absence alerts
4. **Devotions Module** - Daily Catholic devotions (auto-generated at 5AM Kigali time)
5. **Formation Module** - Lessons, quizzes, progress tracking, badges
6. **Messaging Module** - Structured threads, direct messages, rate limiting, safeguarding
7. **Events Module** - Parish calendar, conflict detection
8. **Announcements Module** - Parish-wide and group announcements
9. **Users Module** - Profile management
10. **Audit Module** - Action logging for compliance

### CRON Jobs

- **Daily Devotion Generator**: 5:00 AM Africa/Kigali
- **Absence Alerts**: 8:00 AM Africa/Kigali (checks for 2+ missed meetings)

### Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting (10 messages/minute)
- Message reporting and moderation
- Audit logging for all admin actions
- Safeguarding compliance

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Seed database with demo data
npx prisma db seed

# Start development server
npm run start:dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/urumuri"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="30d"
PORT=3001
```

## API Documentation

Once running, Swagger documentation available at:
- **Local**: http://localhost:3001/api
- **Endpoints**: http://localhost:3001/api-json

## Database Schema

### Hierarchy Structure

```
Diocese
  └── Church (Parish)
      ├── Groups (Praesidium, Charismatic, Choir, etc.)
      └── Events

Senatus (National)
  └── Regio
      └── Comitium
          └── Curia
              └── Praesidium (Group)
```

### Key Entities

- **User**: Members with roles and permissions
- **Diocese/Church**: Geographic hierarchy
- **CouncilHierarchy**: Legion of Mary structure
- **Group**: Catholic communities
- **Membership**: User-Group relationships
- **Meeting**: Scheduled gatherings
- **Attendance**: Check-in records
- **Devotion**: Daily spiritual content (multilingual)
- **FormationLesson**: Educational content
- **Quiz**: Knowledge assessment
- **Badge**: Gamification achievements
- **Event**: Parish calendar items
- **ConversationThread**: Structured group discussions
- **DirectMessage**: Private messaging
- **AuditLog**: Compliance tracking

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Groups
- `GET /groups` - List groups (filter by church/type)
- `GET /groups/my-groups` - User's groups
- `POST /groups/:id/join` - Join group
- `GET /groups/:id/members` - Group members

### Meetings
- `GET /meetings?groupId=xxx` - Group meetings
- `POST /meetings` - Create meeting
- `POST /meetings/:id/checkin` - QR check-in
- `GET /meetings/:id/attendance` - Attendance list

### Devotions
- `GET /devotions/today` - Today's devotion
- `GET /devotions/recent` - Last 7 days

### Formation
- `GET /formation/lessons` - All lessons
- `POST /formation/quizzes/:id/attempt` - Submit quiz
- `GET /formation/progress` - User progress
- `GET /formation/my-badges` - User badges

### Messaging
- `GET /messaging/threads?groupId=xxx` - Group threads
- `POST /messaging/threads` - Create thread
- `POST /messaging/threads/:id/messages` - Send message
- `POST /messaging/direct` - Send DM
- `POST /messaging/messages/:id/report` - Report message

### Events
- `GET /events?churchId=xxx` - Parish calendar
- `POST /events` - Create event
- `GET /events/conflicts/check` - Check conflicts

### Announcements
- `GET /announcements?churchId=xxx` - List announcements
- `POST /announcements` - Create announcement

## Roles & Permissions

1. **YOUTH_USER** - Basic member
2. **GROUP_MEMBER** - Active group participant
3. **GROUP_LEADER** - Group leadership
4. **SECRETARY** - Meeting minutes, records
5. **TREASURER** - Financial tracking
6. **PARISH_ADMIN** - Parish-level administration
7. **COUNCIL_ADMIN** - Curia/Comitium/Regio admin
8. **MODERATOR** - Content moderation
9. **SUPER_ADMIN** - System administration

## Seed Data

Demo data includes:
- 1 Diocese (Kigali)
- 3 Parishes
- 1 Senatus, 1 Regio, 2 Comitiums, 3 Curias, 3 Praesidia
- 6 Groups (various types)
- 4 Test users with different roles
- 7 Days of devotions
- 2 Formation lessons with quizzes
- 3 Badges

### Test Credentials

```
Admin: admin@urumuri.rw / password123
Leader: leader@urumuri.rw / password123
Youth: marie@urumuri.rw / password123
Youth 2: patrick@urumuri.rw / password123
```

## Scripts

```bash
npm run start:dev      # Development with hot reload
npm run build          # Production build
npm run start:prod     # Production server
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run lint           # Lint code
npm run format         # Format code
npx prisma studio      # Database GUI
npx prisma migrate dev # Create migration
```

## Development

### Adding a New Module

```bash
nest g module modules/mymodule
nest g controller modules/mymodule
nest g service modules/mymodule
```

### Creating a Migration

```bash
# After editing schema.prisma
npx prisma migrate dev --name description_of_changes
```

## Production Deployment

1. Set production environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm run start:prod`
5. Setup reverse proxy (nginx)
6. Enable SSL/TLS
7. Configure CORS for frontend domain
8. Setup monitoring (optional: Sentry)

## Timezone

All CRON jobs run in **Africa/Kigali** timezone (CAT - UTC+2).

## Multilingual Support

All public content supports:
- English (en)
- Kinyarwanda (rw)
- French (fr)

Fields: `title_en`, `title_rw`, `title_fr`, etc.

## License

Proprietary - Catholic Church Rwanda

## Support

For issues or questions, contact the development team.
