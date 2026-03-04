# 🚀 URUMURI REGIO - IMMEDIATE ACTION PLAN

**Date**: March 3, 2026  
**Objective**: Complete backend and start frontend development  
**Timeline**: 3-4 weeks to production MVP

---

## 🎯 PHASE 1: BACKEND COMPLETION (2-3 Days)

### Day 1 - Morning: Schema Fix (4 hours)

#### Step 1: Update Prisma Schema
**File**: `backend/prisma/schema.prisma`

Add multilingual fields to these models:

```prisma
// Church - Update
model Church {
  id          String   @id @default(uuid())
  name_en     String   // Add
  name_rw     String?  // Add
  name_fr     String?  // Add
  name        String   // Keep for backward compatibility
  // ... rest of fields
}

// Group - Update
model Group {
  id          String    @id @default(uuid())
  name_en     String    // Add
  name_rw     String?   // Add
  name_fr     String?   // Add
  name        String    // Keep
  description_en String? // Add
  description_rw String? // Add
  description_fr String? // Add
  description String?   // Keep
  // ... rest of fields
}

// Similar updates for:
// - Diocese
// - Senatus
// - Regio
// - Comitium
// - Curia
// - Praesidium
```

**Commands**:
```bash
cd backend
npx prisma format
npx prisma migrate dev --name add_multilingual_fields
```

#### Step 2: Update Seed Script
**File**: `backend/prisma/seed-urumuri.ts`

Update all data creation to include multilingual fields:

```typescript
// Example:
const church = await prisma.church.create({
  data: {
    name: 'Kimironko Parish',
    name_en: 'Kimironko Parish',
    name_rw: 'Paroisse ya Kimironko',
    name_fr: 'Paroisse de Kimironko',
    // ...
  }
});
```

**Commands**:
```bash
npx prisma db seed
```

#### Step 3: Verify Database
```bash
npx prisma studio
# Check that all fields are populated correctly
```

---

### Day 1 - Afternoon: Module Activation (4 hours)

#### Step 1: Rename .TODO Files

**Commands**:
```bash
cd backend/src/modules

# Groups
mv groups/groups.controller.ts.TODO groups/groups.controller.ts
mv groups/groups.service.ts.TODO groups/groups.service.ts
mv groups/groups.module.ts.TODO groups/groups.module.ts

# Meetings
mv meetings/meetings.controller.ts.TODO meetings/meetings.controller.ts
mv meetings/meetings.service.ts.TODO meetings/meetings.service.ts
mv meetings/meetings.module.ts.TODO meetings/meetings.module.ts

# Devotions
mv devotions/devotions.controller.ts.TODO devotions/devotions.controller.ts
mv devotions/devotions.service.ts.TODO devotions/devotions.service.ts
mv devotions/devotions.module.ts.TODO devotions/devotions.module.ts

# Formation
mv formation/formation.controller.ts.TODO formation/formation.controller.ts
mv formation/formation.service.ts.TODO formation/formation.service.ts
mv formation/formation.module.ts.TODO formation/formation.module.ts

# Messaging
mv messaging/messaging.controller.ts.TODO messaging/messaging.controller.ts
mv messaging/messaging.service.ts.TODO messaging/messaging.service.ts
mv messaging/messaging.module.ts.TODO messaging/messaging.module.ts

# Events
mv events/events.controller.ts.TODO events/events.controller.ts
mv events/events.service.ts.TODO events/events.service.ts
mv events/events.module.ts.TODO events/events.module.ts

# Announcements
mv announcements/announcements.controller.ts.TODO announcements/announcements.controller.ts
mv announcements/announcements.service.ts.TODO announcements/announcements.service.ts
mv announcements/announcements.module.ts.TODO announcements/announcements.module.ts
```

#### Step 2: Enable Modules in app.module.ts

**File**: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { DevotionsModule } from './modules/devotions/devotions.module';
import { FormationModule } from './modules/formation/formation.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { EventsModule } from './modules/events/events.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    MeetingsModule,
    DevotionsModule,
    FormationModule,
    MessagingModule,
    EventsModule,
    AnnouncementsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### Step 3: Build and Fix Errors

**Commands**:
```bash
npm run build
```

If errors occur:
1. Check field names in services
2. Verify Prisma client is regenerated: `npx prisma generate`
3. Fix any remaining type mismatches

---

### Day 2 - Morning: Testing (4 hours)

#### Step 1: Start Development Server

```bash
# Terminal 1: Database
docker-compose up postgres

# Terminal 2: Backend
cd backend
npm run start:dev
```

#### Step 2: Test API Endpoints

**Using Swagger**: http://localhost:3001/api/docs

Test each module:

1. **Auth**
   - POST /api/v1/auth/register
   - POST /api/v1/auth/login
   - POST /api/v1/auth/refresh

2. **Groups**
   - GET /api/v1/groups
   - GET /api/v1/groups/:id
   - POST /api/v1/groups/:id/join

3. **Meetings**
   - GET /api/v1/meetings
   - POST /api/v1/meetings
   - POST /api/v1/meetings/:id/checkin

4. **Devotions**
   - GET /api/v1/devotions/today
   - GET /api/v1/devotions/recent

5. **Formation**
   - GET /api/v1/formation/lessons
   - POST /api/v1/formation/quizzes/:id/attempt

6. **Messaging**
   - GET /api/v1/messaging/threads
   - POST /api/v1/messaging/threads
   - POST /api/v1/messaging/direct

7. **Events**
   - GET /api/v1/events
   - POST /api/v1/events

8. **Announcements**
   - GET /api/v1/announcements
   - POST /api/v1/announcements

#### Step 3: Test CRON Jobs

**Option A: Wait for scheduled time**
- Devotion: 5:00 AM
- Absence: 8:00 AM

**Option B: Trigger manually** (add test endpoint)

```typescript
// In devotions.controller.ts
@Get('test/generate')
async testGenerate() {
  return this.devotionsService.generateDailyDevotion();
}
```

---

### Day 2 - Afternoon: Documentation & QA (4 hours)

#### Step 1: Complete Swagger Documentation

Add examples to all endpoints:

```typescript
@ApiOperation({ summary: 'Get all groups' })
@ApiQuery({ name: 'churchId', required: false })
@ApiQuery({ name: 'type', required: false, enum: GroupType })
@ApiResponse({ status: 200, description: 'List of groups' })
@Get()
async findAll(@Query() query: any) {
  // ...
}
```

#### Step 2: Update README

**File**: `backend/README.md`

- Update setup instructions
- Add API endpoint list
- Add troubleshooting section
- Add deployment guide

#### Step 3: Run QA Checklist

- [ ] All endpoints return correct status codes
- [ ] Authentication works correctly
- [ ] RBAC enforces permissions
- [ ] Rate limiting works
- [ ] Validation catches invalid input
- [ ] Error messages are clear
- [ ] Audit logs are created
- [ ] CRON jobs execute successfully

---

## 🎨 PHASE 2: FRONTEND DEVELOPMENT (10-12 Days)

### Day 3-4: Project Setup (2 days)

#### Step 1: Initialize Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install next-intl zustand @tanstack/react-query axios zod
npm install -D @types/node
```

#### Step 3: Install shadcn/ui

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label form dialog
```

#### Step 4: Setup Internationalization

**File**: `frontend/i18n.ts`

```typescript
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

**Files**: Create message files
- `frontend/messages/en.json`
- `frontend/messages/rw.json`
- `frontend/messages/fr.json`

#### Step 5: Setup API Client

**File**: `frontend/lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Step 6: Setup Authentication Store

**File**: `frontend/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        // API call
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

### Day 5-7: Core Pages (3 days)

#### Day 5: Authentication Flow

**Pages**:
1. `app/[locale]/(auth)/login/page.tsx`
2. `app/[locale]/(auth)/register/page.tsx`
3. `app/[locale]/(auth)/onboarding/page.tsx`

**Components**:
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`
- `components/auth/OnboardingWizard.tsx`

#### Day 6: Home & Groups

**Pages**:
1. `app/[locale]/(dashboard)/page.tsx` - Home
2. `app/[locale]/(dashboard)/groups/page.tsx` - Browse Groups
3. `app/[locale]/(dashboard)/groups/[id]/page.tsx` - Group Detail

**Components**:
- `components/devotion/DailyDevotion.tsx`
- `components/groups/GroupCard.tsx`
- `components/groups/GroupList.tsx`
- `components/groups/JoinButton.tsx`

#### Day 7: Meetings & Profile

**Pages**:
1. `app/[locale]/(dashboard)/meetings/page.tsx`
2. `app/[locale]/(dashboard)/profile/page.tsx`

**Components**:
- `components/meetings/MeetingCard.tsx`
- `components/meetings/QRScanner.tsx`
- `components/meetings/AttendanceList.tsx`
- `components/profile/ProfileForm.tsx`
- `components/profile/BadgeDisplay.tsx`

---

### Day 8-10: Advanced Features (3 days)

#### Day 8: Formation & Messaging

**Pages**:
1. `app/[locale]/(dashboard)/formation/page.tsx`
2. `app/[locale]/(dashboard)/formation/[id]/page.tsx`
3. `app/[locale]/(dashboard)/messages/page.tsx`

**Components**:
- `components/formation/LessonCard.tsx`
- `components/formation/Quiz.tsx`
- `components/formation/ProgressBar.tsx`
- `components/messaging/ThreadList.tsx`
- `components/messaging/MessageThread.tsx`

#### Day 9: Calendar & Events

**Pages**:
1. `app/[locale]/(dashboard)/calendar/page.tsx`
2. `app/[locale]/(dashboard)/events/[id]/page.tsx`

**Components**:
- `components/calendar/EventCalendar.tsx`
- `components/calendar/EventCard.tsx`
- `components/calendar/ConflictWarning.tsx`

#### Day 10: Admin Panel

**Pages**:
1. `app/[locale]/(admin)/dashboard/page.tsx`
2. `app/[locale]/(admin)/users/page.tsx`
3. `app/[locale]/(admin)/moderation/page.tsx`

**Components**:
- `components/admin/Dashboard.tsx`
- `components/admin/UserTable.tsx`
- `components/admin/ModerationQueue.tsx`

---

### Day 11-12: PWA & Polish (2 days)

#### Day 11: PWA Configuration

**File**: `public/manifest.json`

```json
{
  "name": "URUMURI REGIO",
  "short_name": "Urumuri",
  "description": "Catholic Youth & Legion Management",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**File**: `public/sw.js` (Service Worker)

```javascript
const CACHE_NAME = 'urumuri-v1';
const urlsToCache = [
  '/',
  '/api/v1/devotions/today',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### Day 12: Optimization & Testing

**Tasks**:
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Offline functionality

---

## 🚀 PHASE 3: DEPLOYMENT (2-3 Days)

### Day 13: Backend Deployment

#### Option A: Docker on VPS

```bash
# On server
git clone <repo>
cd urumuri-regio
cp backend/.env.example backend/.env
# Edit .env with production values

docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

#### Option B: Managed Services

- **Database**: Railway, Supabase, or Neon
- **Backend**: Railway, Render, or Fly.io
- **Setup**: Connect database, deploy backend

### Day 14: Frontend Deployment

#### Vercel (Recommended)

```bash
cd frontend
vercel --prod
```

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: Backend URL
- `NEXT_PUBLIC_APP_URL`: Frontend URL

#### Alternative: Netlify

```bash
cd frontend
netlify deploy --prod
```

### Day 15: Post-Deployment

**Tasks**:
- [ ] Configure custom domain
- [ ] Setup SSL certificates
- [ ] Configure CORS
- [ ] Setup monitoring (Sentry)
- [ ] Configure backups
- [ ] Load testing
- [ ] Security audit
- [ ] Documentation update

---

## 📋 DAILY CHECKLIST TEMPLATE

### Morning Standup (15 min)
- [ ] Review yesterday's progress
- [ ] Identify blockers
- [ ] Set today's goals
- [ ] Assign tasks

### Development (6 hours)
- [ ] Complete assigned tasks
- [ ] Write tests
- [ ] Update documentation
- [ ] Code review

### End of Day (30 min)
- [ ] Commit and push code
- [ ] Update task board
- [ ] Document issues
- [ ] Plan tomorrow

---

## 🎯 SUCCESS CRITERIA

### Backend Complete When:
- [ ] All modules enabled and working
- [ ] All API endpoints tested
- [ ] CRON jobs executing
- [ ] Swagger docs complete
- [ ] Zero build errors
- [ ] Security audit passed

### Frontend MVP Complete When:
- [ ] All P0 pages implemented
- [ ] Authentication working
- [ ] Core features functional
- [ ] PWA configured
- [ ] 3 languages supported
- [ ] Mobile responsive
- [ ] Lighthouse score > 90

### Production Ready When:
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrated
- [ ] SSL configured
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Load tested
- [ ] Documentation complete

---

## 🆘 TROUBLESHOOTING GUIDE

### Issue: Build Errors After Schema Update

**Solution**:
```bash
npx prisma generate
npm run build
```

### Issue: CRON Jobs Not Running

**Check**:
1. Timezone configuration: `TZ=Africa/Kigali`
2. ScheduleModule imported
3. Service decorated with `@Injectable()`
4. Method decorated with `@Cron()`

### Issue: Authentication Failing

**Check**:
1. JWT_SECRET in .env
2. Token in Authorization header
3. User exists in database
4. Password hashed correctly

### Issue: CORS Errors

**Solution**:
```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

---

## 📞 SUPPORT CONTACTS

### Technical Issues
- Backend Lead: [Contact]
- Frontend Lead: [Contact]
- DevOps Lead: [Contact]

### Product Questions
- Product Manager: [Contact]
- QA Lead: [Contact]

### Emergency
- On-Call Engineer: [Contact]

---

**Last Updated**: March 3, 2026  
**Next Review**: After Phase 1 Completion  
**Status**: Ready to Execute
