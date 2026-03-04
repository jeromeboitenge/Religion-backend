# 🔧 SCHEMA FIX GUIDE - Quick Reference

**Objective**: Add multilingual field support to Prisma schema  
**Time Required**: 1 hour  
**Impact**: Enables all 7 disabled modules

---

## 🎯 WHAT NEEDS TO BE FIXED

The code expects multilingual fields (`name_en`, `name_rw`, `name_fr`) but the schema only has single fields (`name`).

### Models Requiring Updates

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

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### Step 1: Backup Current Database

```bash
cd backend
docker-compose exec postgres pg_dump -U postgres urumuri > backup_$(date +%Y%m%d).sql
```

### Step 2: Update Prisma Schema

**File**: `backend/prisma/schema.prisma`

#### Diocese Model

```prisma
model Diocese {
  id          String   @id @default(uuid())
  name        String   @unique
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  churches    Church[]
  senatus     Senatus[]
}
```

#### Church Model

```prisma
model Church {
  id          String   @id @default(uuid())
  name        String
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  district    String
  sector      String?
  address     String?
  address_en  String?  // ADD
  address_rw  String?  // ADD
  address_fr  String?  // ADD
  contactPhone String?
  contactEmail String?
  logoUrl     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  dioceseId   String
  diocese     Diocese  @relation(fields: [dioceseId], references: [id])
  
  groups      Group[]
  events      Event[]
  announcements Announcement[]
  primaryUsers User[]  @relation("PrimaryChurch")
}
```

#### Senatus Model

```prisma
model Senatus {
  id          String   @id @default(uuid())
  name        String
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  dioceseId   String
  diocese     Diocese  @relation(fields: [dioceseId], references: [id])
  
  regios      Regio[]
}
```

#### Regio Model

```prisma
model Regio {
  id          String   @id @default(uuid())
  name        String
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  senatusId   String?
  senatus     Senatus? @relation(fields: [senatusId], references: [id])
  
  comitiums   Comitium[]
}
```

#### Comitium Model

```prisma
model Comitium {
  id          String   @id @default(uuid())
  name        String
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  regioId     String
  regio       Regio    @relation(fields: [regioId], references: [id])
  
  curias      Curia[]
}
```

#### Curia Model

```prisma
model Curia {
  id          String   @id @default(uuid())
  name        String
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  comitiumId  String
  comitium    Comitium @relation(fields: [comitiumId], references: [id])
  
  praesidia   Praesidium[]
}
```

#### Praesidium Model

```prisma
model Praesidium {
  id          String   @id @default(uuid())
  name        String
  name_en     String   // ADD
  name_rw     String?  // ADD
  name_fr     String?  // ADD
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  curiaId     String
  curia       Curia    @relation(fields: [curiaId], references: [id])
  
  groupId     String   @unique
  group       Group    @relation(fields: [groupId], references: [id])
}
```

#### Group Model

```prisma
model Group {
  id          String    @id @default(uuid())
  name        String
  name_en     String    // ADD
  name_rw     String?   // ADD
  name_fr     String?   // ADD
  type        GroupType
  description String?
  description_en String?  // ADD
  description_rw String?  // ADD
  description_fr String?  // ADD
  meetingDay  String?
  meetingTime String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  churchId    String
  church      Church    @relation(fields: [churchId], references: [id])
  
  praesidium  Praesidium?
  memberships Membership[]
  meetings    Meeting[]
  threads     ConversationThread[]
  events      Event[]
}
```

#### FormationLesson Model

```prisma
model FormationLesson {
  id          String         @id @default(uuid())
  title_en    String
  title_rw    String?
  title_fr    String?
  content_en  String
  content_rw  String?
  content_fr  String?
  level       FormationLevel @default(BEGINNER)
  orderIndex  Int
  durationMin Int            @default(5)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  quizzes     Quiz[]
}
```

#### Badge Model

```prisma
model Badge {
  id          String   @id @default(uuid())
  name_en     String
  name_rw     String?
  name_fr     String?
  description_en String
  description_rw String?
  description_fr String?
  iconUrl     String?
  criteria    Json
  createdAt   DateTime @default(now())
  
  userBadges  UserBadge[]
}
```

### Step 3: Format and Validate

```bash
npx prisma format
npx prisma validate
```

### Step 4: Create Migration

```bash
npx prisma migrate dev --name add_multilingual_fields
```

This will:
1. Create a new migration file
2. Apply it to the database
3. Regenerate Prisma Client

### Step 5: Update Seed Script

**File**: `backend/prisma/seed-urumuri.ts`

Update all data creation to include multilingual fields:

```typescript
// Diocese
const diocese = await prisma.diocese.create({
  data: {
    name: 'Archdiocese of Kigali',
    name_en: 'Archdiocese of Kigali',
    name_rw: 'Diyoseze ya Kigali',
    name_fr: 'Archidiocèse de Kigali',
    description: 'Catholic Archdiocese of Kigali',
    description_en: 'Catholic Archdiocese of Kigali',
    description_rw: 'Diyoseze Gatolika ya Kigali',
    description_fr: 'Archidiocèse Catholique de Kigali',
  },
});

// Church
const kimironko = await prisma.church.create({
  data: {
    name: 'Kimironko Parish',
    name_en: 'Kimironko Parish',
    name_rw: 'Paroisse ya Kimironko',
    name_fr: 'Paroisse de Kimironko',
    district: 'Gasabo',
    sector: 'Kimironko',
    address: 'KG 7 Ave, Kigali',
    address_en: 'KG 7 Ave, Kigali',
    address_rw: 'KG 7 Ave, Kigali',
    address_fr: 'KG 7 Ave, Kigali',
    contactPhone: '+250788123456',
    contactEmail: 'info@kimironko.church',
    dioceseId: diocese.id,
  },
});

// Senatus
const senatus = await prisma.senatus.create({
  data: {
    name: 'Senatus of Rwanda',
    name_en: 'Senatus of Rwanda',
    name_rw: 'Senatus yu Rwanda',
    name_fr: 'Sénat du Rwanda',
    description: 'National Legion of Mary Council',
    description_en: 'National Legion of Mary Council',
    description_rw: 'Inama y\'Igihugu ya Legion ya Mariya',
    description_fr: 'Conseil National de la Légion de Marie',
    dioceseId: diocese.id,
  },
});

// Regio
const regio = await prisma.regio.create({
  data: {
    name: 'Regio of Kigali',
    name_en: 'Regio of Kigali',
    name_rw: 'Regio ya Kigali',
    name_fr: 'Regio de Kigali',
    description: 'Kigali Regional Council',
    description_en: 'Kigali Regional Council',
    description_rw: 'Inama y\'Akarere ka Kigali',
    description_fr: 'Conseil Régional de Kigali',
    senatusId: senatus.id,
  },
});

// Comitium
const comitium1 = await prisma.comitium.create({
  data: {
    name: 'Comitium of Gasabo',
    name_en: 'Comitium of Gasabo',
    name_rw: 'Comitium ya Gasabo',
    name_fr: 'Comitium de Gasabo',
    description: 'Gasabo District Council',
    description_en: 'Gasabo District Council',
    description_rw: 'Inama y\'Akarere ka Gasabo',
    description_fr: 'Conseil de District de Gasabo',
    regioId: regio.id,
  },
});

// Curia
const curia1 = await prisma.curia.create({
  data: {
    name: 'Curia of Kimironko',
    name_en: 'Curia of Kimironko',
    name_rw: 'Curia ya Kimironko',
    name_fr: 'Curie de Kimironko',
    description: 'Kimironko Parish Council',
    description_en: 'Kimironko Parish Council',
    description_rw: 'Inama ya Paroisse ya Kimironko',
    description_fr: 'Conseil Paroissial de Kimironko',
    comitiumId: comitium1.id,
  },
});

// Group
const youthGroup = await prisma.group.create({
  data: {
    name: 'Kimironko Youth',
    name_en: 'Kimironko Youth',
    name_rw: 'Urubyiruko rwa Kimironko',
    name_fr: 'Jeunesse de Kimironko',
    type: 'YOUTH_GROUP',
    description: 'Catholic Youth Community',
    description_en: 'Catholic Youth Community',
    description_rw: 'Umuryango w\'Urubyiruko Gatolika',
    description_fr: 'Communauté de Jeunesse Catholique',
    meetingDay: 'Sunday',
    meetingTime: '14:00',
    churchId: kimironko.id,
  },
});

// Praesidium
const praesidium1 = await prisma.praesidium.create({
  data: {
    name: 'Our Lady of Peace',
    name_en: 'Our Lady of Peace',
    name_rw: 'Nyina wa Jambo Amahoro',
    name_fr: 'Notre-Dame de la Paix',
    description: 'Legion of Mary Praesidium',
    description_en: 'Legion of Mary Praesidium',
    description_rw: 'Praesidium ya Legion ya Mariya',
    description_fr: 'Praesidium de la Légion de Marie',
    curiaId: curia1.id,
    groupId: legionGroup.id,
  },
});

// Badge
const firstMeeting = await prisma.badge.create({
  data: {
    name_en: 'First Meeting',
    name_rw: 'Inama ya Mbere',
    name_fr: 'Première Réunion',
    description_en: 'Attended your first group meeting',
    description_rw: 'Witabye inama ya mbere y\'itsinda',
    description_fr: 'Assisté à votre première réunion de groupe',
    iconUrl: '/badges/first-meeting.svg',
    criteria: { type: 'ATTENDANCE_COUNT', value: 1 },
  },
});

// FormationLesson
const lesson1 = await prisma.formationLesson.create({
  data: {
    title_en: 'Introduction to Catholic Faith',
    title_rw: 'Intangiriro ku Kwizera Gatolika',
    title_fr: 'Introduction à la Foi Catholique',
    content_en: 'Learn the basics of Catholic faith...',
    content_rw: 'Wiga ibanze by\'ukwizera Gatolika...',
    content_fr: 'Apprenez les bases de la foi catholique...',
    level: 'BEGINNER',
    orderIndex: 1,
    durationMin: 5,
  },
});
```

### Step 6: Run Seed

```bash
npx prisma db seed
```

### Step 7: Verify in Prisma Studio

```bash
npx prisma studio
```

Check that all multilingual fields are populated.

---

## ✅ VERIFICATION CHECKLIST

After completing the schema fix:

- [ ] Migration created successfully
- [ ] Migration applied to database
- [ ] Prisma Client regenerated
- [ ] Seed script updated
- [ ] Seed data loaded successfully
- [ ] All multilingual fields populated
- [ ] No TypeScript errors in services
- [ ] Build completes successfully

---

## 🔄 ROLLBACK PROCEDURE

If something goes wrong:

### Option 1: Restore from Backup

```bash
docker-compose exec -T postgres psql -U postgres urumuri < backup_YYYYMMDD.sql
```

### Option 2: Reset Database

```bash
npx prisma migrate reset
# This will drop the database, run all migrations, and seed
```

---

## 🐛 COMMON ISSUES

### Issue: Migration Fails

**Error**: `Column already exists`

**Solution**: Drop the column first or use `ALTER TABLE IF NOT EXISTS`

### Issue: Seed Fails

**Error**: `Missing required field`

**Solution**: Ensure all required multilingual fields are provided

### Issue: TypeScript Errors Persist

**Solution**:
```bash
npx prisma generate
rm -rf node_modules/.prisma
npm install
```

---

## 📊 EXPECTED RESULTS

After successful schema fix:

1. **Database**: All models have multilingual fields
2. **Seed Data**: All records have en/rw/fr values
3. **TypeScript**: Zero compilation errors
4. **Build**: Successful build
5. **Modules**: Ready to be enabled

---

## ⏱️ TIME BREAKDOWN

- Schema updates: 20 minutes
- Migration creation: 5 minutes
- Seed script updates: 20 minutes
- Testing & verification: 15 minutes
- **Total**: ~60 minutes

---

## 📞 NEED HELP?

If you encounter issues:

1. Check the error message carefully
2. Verify Prisma syntax
3. Ensure database is running
4. Check environment variables
5. Review migration history

---

**Last Updated**: March 3, 2026  
**Status**: Ready to Execute  
**Next Step**: Run the migration
