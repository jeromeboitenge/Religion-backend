# ⚡ URUMURI REGIO - QUICK START GUIDE

**Get the backend running in 1 hour**

---

## 🎯 GOAL

Fix the schema mismatch and enable all 7 disabled modules.

---

## ⏱️ TIME REQUIRED

- Schema fix: 20 minutes
- Module activation: 15 minutes
- Testing: 15 minutes
- Documentation: 10 minutes
- **Total: 60 minutes**

---

## 📋 PREREQUISITES

- Docker installed
- Node.js 18+ installed
- Git repository cloned
- Terminal access

---

## 🚀 STEP-BY-STEP INSTRUCTIONS

### Step 1: Start Database (2 minutes)

```bash
# From project root
docker-compose up -d postgres

# Verify it's running
docker-compose ps
```

### Step 2: Update Prisma Schema (15 minutes)

Open `backend/prisma/schema.prisma` and add multilingual fields to these models:

**Quick Reference**: Add these fields to each model:
```prisma
name_en     String
name_rw     String?
name_fr     String?
description_en String?
description_rw String?
description_fr String?
```

**Models to update**:
1. Diocese
2. Church
3. Senatus
4. Regio
5. Comitium
6. Curia
7. Praesidium
8. Group
9. FormationLesson
10. Badge

**Detailed examples in**: `SCHEMA_FIX_GUIDE.md`

### Step 3: Create Migration (3 minutes)

```bash
cd backend

# Format schema
npx prisma format

# Create migration
npx prisma migrate dev --name add_multilingual_fields

# This will:
# - Create migration file
# - Apply to database
# - Regenerate Prisma Client
```

### Step 4: Update Seed Script (10 minutes)

Open `backend/prisma/seed-urumuri.ts` and add multilingual values to all data creation.

**Example**:
```typescript
const diocese = await prisma.diocese.create({
  data: {
    name: 'Archdiocese of Kigali',
    name_en: 'Archdiocese of Kigali',
    name_rw: 'Diyoseze ya Kigali',
    name_fr: 'Archidiocèse de Kigali',
    // ... rest of fields
  },
});
```

**Detailed examples in**: `SCHEMA_FIX_GUIDE.md`

### Step 5: Run Seed (2 minutes)

```bash
npx prisma db seed
```

### Step 6: Rename .TODO Files (5 minutes)

```bash
cd src/modules

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

### Step 7: Enable Modules (3 minutes)

Open `backend/src/app.module.ts` and uncomment the imports:

```typescript
import { GroupsModule } from './modules/groups/groups.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { DevotionsModule } from './modules/devotions/devotions.module';
import { FormationModule } from './modules/formation/formation.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { EventsModule } from './modules/events/events.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';

@Module({
  imports: [
    // ... existing imports
    GroupsModule,
    MeetingsModule,
    DevotionsModule,
    FormationModule,
    MessagingModule,
    EventsModule,
    AnnouncementsModule,
    // ... rest
  ],
})
```

### Step 8: Build (2 minutes)

```bash
npm run build
```

**Expected**: Zero errors

If errors occur:
```bash
npx prisma generate
npm run build
```

### Step 9: Start Server (1 minute)

```bash
npm run start:dev
```

**Expected output**:
```
🚀 URUMURI REGIO API: http://localhost:3001/api/v1
📚 Swagger Docs: http://localhost:3001/api/docs
```

### Step 10: Test API (10 minutes)

Open browser: http://localhost:3001/api/docs

**Test these endpoints**:

1. **Auth**
   - POST `/api/v1/auth/register`
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "displayName": "Test User"
   }
   ```
   
   - POST `/api/v1/auth/login`
   ```json
   {
     "email": "admin@urumuri.rw",
     "password": "password123"
   }
   ```
   
   Copy the `access_token` from response

2. **Groups** (use token in Authorization header)
   - GET `/api/v1/groups`
   - GET `/api/v1/groups/{id}`

3. **Meetings**
   - GET `/api/v1/meetings`

4. **Devotions**
   - GET `/api/v1/devotions/today`

5. **Formation**
   - GET `/api/v1/formation/lessons`

6. **Events**
   - GET `/api/v1/events`

---

## ✅ SUCCESS CHECKLIST

After completing all steps:

- [ ] Database running
- [ ] Schema updated with multilingual fields
- [ ] Migration applied successfully
- [ ] Seed data loaded
- [ ] All .TODO files renamed
- [ ] Modules enabled in app.module.ts
- [ ] Build completes with zero errors
- [ ] Server starts successfully
- [ ] Swagger docs accessible
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] All modules active

---

## 🐛 TROUBLESHOOTING

### Issue: Migration fails

**Error**: `Column already exists`

**Solution**:
```bash
npx prisma migrate reset
npx prisma migrate dev --name add_multilingual_fields
npx prisma db seed
```

### Issue: Build errors persist

**Solution**:
```bash
npx prisma generate
rm -rf node_modules/.prisma
npm install
npm run build
```

### Issue: Seed fails

**Error**: `Missing required field`

**Solution**: Check that all multilingual fields are provided in seed script

### Issue: Server won't start

**Check**:
1. Database is running: `docker-compose ps`
2. Environment variables: Check `.env` file
3. Port 3001 is free: `lsof -i :3001`

---

## 📊 VERIFICATION

### Test Credentials

```
Admin:  admin@urumuri.rw / password123
Leader: leader@urumuri.rw / password123
Youth:  marie@urumuri.rw / password123
```

### Expected Data

- 1 Diocese (Kigali)
- 3 Parishes (Kimironko, Remera, Nyamirambo)
- 1 Senatus, 1 Regio, 2 Comitiums, 3 Curias, 3 Praesidia
- 6 Groups
- 4 Users
- 7 Devotions
- 2 Formation lessons
- 3 Badges

### Verify in Prisma Studio

```bash
npx prisma studio
```

Browse tables and verify multilingual fields are populated.

---

## 🎯 NEXT STEPS

After backend is working:

1. **Complete API Documentation**
   - Add request/response examples to Swagger
   - Document authentication flow
   - Add error code reference

2. **Test CRON Jobs**
   - Wait for 5:00 AM (devotion generation)
   - Wait for 8:00 AM (absence alerts)
   - Or add test endpoints to trigger manually

3. **Start Frontend Development**
   - Initialize Next.js project
   - Setup Tailwind CSS
   - Implement authentication
   - Build core pages

---

## 📚 DOCUMENTATION

- **Detailed Analysis**: `SENIOR_TEAM_ANALYSIS.md`
- **Schema Fix Guide**: `SCHEMA_FIX_GUIDE.md`
- **Full Action Plan**: `ACTION_PLAN.md`
- **Executive Summary**: `EXECUTIVE_SUMMARY.md`
- **Project Overview**: `PROJECT_SUMMARY.md`

---

## 🆘 NEED HELP?

1. Check error messages carefully
2. Review documentation files
3. Verify environment variables
4. Check database connection
5. Ensure all dependencies installed

---

**Last Updated**: March 3, 2026  
**Estimated Time**: 60 minutes  
**Difficulty**: Easy  
**Status**: Ready to Execute
