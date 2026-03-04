import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding URUMURI REGIO database...');

  // Create Diocese
  const diocese = await prisma.diocese.create({
    data: {
      name: 'Diocese of Kigali',
      name_en: 'Diocese of Kigali',
      name_rw: 'Diyoseze ya Kigali',
      name_fr: 'Diocèse de Kigali',
      description: 'Catholic Diocese of Kigali, Rwanda',
      description_en: 'Catholic Diocese of Kigali, Rwanda',
      description_rw: 'Diyoseze Gatolika ya Kigali, u Rwanda',
      description_fr: 'Diocèse Catholique de Kigali, Rwanda',
    },
  });

  // Create Churches (Parishes)
  const parishes = await Promise.all([
    prisma.church.create({
      data: {
        name: 'St. Michael Parish',
        name_en: 'St. Michael Parish',
        name_rw: 'Paruwasi ya Mutagatifu Mikayeli',
        name_fr: 'Paroisse Saint-Michel',
        district: 'Gasabo',
        sector: 'Remera',
        address: 'KG 11 Ave, Kigali',
        address_en: 'KG 11 Ave, Kigali',
        address_rw: 'KG 11 Ave, Kigali',
        address_fr: 'KG 11 Ave, Kigali',
        contactPhone: '+250788123456',
        contactEmail: 'stmichael@catholic.rw',
        dioceseId: diocese.id,
      },
    }),
    prisma.church.create({
      data: {
        name: 'Regina Pacis Parish',
        name_en: 'Regina Pacis Parish',
        name_rw: 'Paruwasi ya Regina Pacis',
        name_fr: 'Paroisse Regina Pacis',
        district: 'Kicukiro',
        sector: 'Gikondo',
        address: 'KK 15 St, Kigali',
        address_en: 'KK 15 St, Kigali',
        address_rw: 'KK 15 St, Kigali',
        address_fr: 'KK 15 St, Kigali',
        contactPhone: '+250788234567',
        contactEmail: 'reginapacis@catholic.rw',
        dioceseId: diocese.id,
      },
    }),
    prisma.church.create({
      data: {
        name: 'Holy Family Parish',
        name_en: 'Holy Family Parish',
        name_rw: 'Paruwasi y\'Umuryango Wera',
        name_fr: 'Paroisse de la Sainte Famille',
        district: 'Nyarugenge',
        sector: 'Nyamirambo',
        address: 'KN 5 Rd, Kigali',
        address_en: 'KN 5 Rd, Kigali',
        address_rw: 'KN 5 Rd, Kigali',
        address_fr: 'KN 5 Rd, Kigali',
        contactPhone: '+250788345678',
        contactEmail: 'holyfamily@catholic.rw',
        dioceseId: diocese.id,
      },
    }),
  ]);

  // Create Legion Hierarchy
  const senatus = await prisma.senatus.create({
    data: {
      name: 'Senatus of Rwanda',
      name_en: 'Senatus of Rwanda',
      name_rw: 'Senatus y\'u Rwanda',
      name_fr: 'Senatus du Rwanda',
      description: 'National Legion of Mary Council',
      description_en: 'National Legion of Mary Council',
      description_rw: 'Inama y\'Igihugu ya Legion ya Mariya',
      description_fr: 'Conseil National de la Légion de Marie',
      dioceseId: diocese.id,
    },
  });

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

  const comitiums = await Promise.all([
    prisma.comitium.create({
      data: {
        name: 'Comitium of Gasabo',
        name_en: 'Comitium of Gasabo',
        name_rw: 'Comitium ya Gasabo',
        name_fr: 'Comitium de Gasabo',
        regioId: regio.id,
      },
    }),
    prisma.comitium.create({
      data: {
        name: 'Comitium of Kicukiro',
        name_en: 'Comitium of Kicukiro',
        name_rw: 'Comitium ya Kicukiro',
        name_fr: 'Comitium de Kicukiro',
        regioId: regio.id,
      },
    }),
  ]);

  const curias = await Promise.all([
    prisma.curia.create({
      data: {
        name: 'Curia of Remera',
        name_en: 'Curia of Remera',
        name_rw: 'Curia ya Remera',
        name_fr: 'Curie de Remera',
        comitiumId: comitiums[0].id,
      },
    }),
    prisma.curia.create({
      data: {
        name: 'Curia of Kimironko',
        name_en: 'Curia of Kimironko',
        name_rw: 'Curia ya Kimironko',
        name_fr: 'Curie de Kimironko',
        comitiumId: comitiums[0].id,
      },
    }),
    prisma.curia.create({
      data: {
        name: 'Curia of Gikondo',
        name_en: 'Curia of Gikondo',
        name_rw: 'Curia ya Gikondo',
        name_fr: 'Curie de Gikondo',
        comitiumId: comitiums[1].id,
      },
    }),
  ]);

  // Create Groups
  const groups = [];
  
  // Praesidia for St. Michael
  for (let i = 0; i < 3; i++) {
    const group = await prisma.group.create({
      data: {
        name: `Praesidium of Our Lady ${i + 1}`,
        name_en: `Praesidium of Our Lady ${i + 1}`,
        name_rw: `Praesidium ya Bikira Mariya ${i + 1}`,
        name_fr: `Praesidium de Notre-Dame ${i + 1}`,
        type: 'LEGION_PRAESIDIUM',
        description: 'Active Legion of Mary Praesidium',
        description_en: 'Active Legion of Mary Praesidium',
        description_rw: 'Praesidium ikora ya Legion ya Mariya',
        description_fr: 'Praesidium actif de la Légion de Marie',
        meetingDay: 'Sunday',
        meetingTime: '14:00',
        churchId: parishes[0].id,
      },
    });
    
    await prisma.praesidium.create({
      data: {
        name: group.name,
        name_en: group.name_en,
        name_rw: group.name_rw,
        name_fr: group.name_fr,
        groupId: group.id,
        curiaId: curias[i % 2].id,
      },
    });
    
    groups.push(group);
  }

  // Other groups
  groups.push(
    await prisma.group.create({
      data: {
        name: 'Catholic Charismatic Renewal',
        name_en: 'Catholic Charismatic Renewal',
        name_rw: 'Ivugurura rya Karismatike Gatolika',
        name_fr: 'Renouveau Charismatique Catholique',
        type: 'CHARISMATIC',
        description: 'Youth Charismatic Prayer Group',
        description_en: 'Youth Charismatic Prayer Group',
        description_rw: 'Itsinda ry\'Urubyiruko ryo Gusenga Karismatike',
        description_fr: 'Groupe de Prière Charismatique des Jeunes',
        meetingDay: 'Friday',
        meetingTime: '18:00',
        churchId: parishes[0].id,
      },
    }),
    await prisma.group.create({
      data: {
        name: 'St. Michael Youth Choir',
        name_en: 'St. Michael Youth Choir',
        name_rw: 'Kwaya y\'Urubyiruko ya Mutagatifu Mikayeli',
        name_fr: 'Chorale des Jeunes Saint-Michel',
        type: 'CHOIR',
        description: 'Parish Youth Choir',
        description_en: 'Parish Youth Choir',
        description_rw: 'Kwaya y\'Urubyiruko ya Paruwasi',
        description_fr: 'Chorale des Jeunes de la Paroisse',
        meetingDay: 'Saturday',
        meetingTime: '15:00',
        churchId: parishes[0].id,
      },
    }),
    await prisma.group.create({
      data: {
        name: 'Catholic Action Youth',
        name_en: 'Catholic Action Youth',
        name_rw: 'Urubyiruko rw\'Igikorwa Gatolika',
        name_fr: 'Action Catholique des Jeunes',
        type: 'CATHOLIC_ACTION',
        description: 'Catholic Action for Youth',
        description_en: 'Catholic Action for Youth',
        description_rw: 'Igikorwa Gatolika ku Rubyiruko',
        description_fr: 'Action Catholique pour les Jeunes',
        meetingDay: 'Wednesday',
        meetingTime: '17:00',
        churchId: parishes[1].id,
      },
    }),
  );

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@urumuri.rw',
        password: hashedPassword,
        displayName: 'System Admin',
        phoneNumber: '+250788111111',
        district: 'Gasabo',
        language: 'EN',
        role: 'SUPER_ADMIN',
        onboardingComplete: true,
        primaryChurchId: parishes[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'leader@urumuri.rw',
        password: hashedPassword,
        displayName: 'Jean Claude Mugabo',
        phoneNumber: '+250788222222',
        district: 'Gasabo',
        language: 'RW',
        role: 'GROUP_LEADER',
        onboardingComplete: true,
        primaryChurchId: parishes[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'marie@urumuri.rw',
        password: hashedPassword,
        displayName: 'Marie Uwase',
        phoneNumber: '+250788333333',
        district: 'Gasabo',
        language: 'RW',
        role: 'YOUTH_USER',
        onboardingComplete: true,
        primaryChurchId: parishes[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'patrick@urumuri.rw',
        password: hashedPassword,
        displayName: 'Patrick Niyonzima',
        phoneNumber: '+250788444444',
        district: 'Kicukiro',
        language: 'FR',
        role: 'YOUTH_USER',
        onboardingComplete: true,
        primaryChurchId: parishes[1].id,
      },
    }),
  ]);

  // Create Memberships
  await Promise.all([
    prisma.membership.create({
      data: {
        userId: users[1].id,
        groupId: groups[0].id,
        status: 'ACTIVE',
        role: 'LEADER',
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[2].id,
        groupId: groups[0].id,
        status: 'ACTIVE',
        role: 'MEMBER',
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[2].id,
        groupId: groups[3].id,
        status: 'ACTIVE',
        role: 'MEMBER',
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[3].id,
        groupId: groups[5].id,
        status: 'ACTIVE',
        role: 'MEMBER',
      },
    }),
  ]);

  // Create Formation Lessons
  const lessons = await Promise.all([
    prisma.formationLesson.create({
      data: {
        title_en: 'Introduction to Catholic Faith',
        title_rw: 'Ibyerekeye Idini Gatolika',
        title_fr: 'Introduction à la Foi Catholique',
        content_en: 'Learn the basics of Catholic faith and tradition.',
        content_rw: 'Wiga ibanze ku idini Gatolika n\'imigenzo yacyo.',
        content_fr: 'Apprenez les bases de la foi et de la tradition catholiques.',
        level: 'BEGINNER',
        orderIndex: 1,
        durationMin: 5,
      },
    }),
    prisma.formationLesson.create({
      data: {
        title_en: 'Legion of Mary Basics',
        title_rw: 'Ibanze kuri Legion ya Mariya',
        title_fr: 'Bases de la Légion de Marie',
        content_en: 'Understanding the Legion of Mary structure and mission.',
        content_rw: 'Gusobanukirwa imiterere n\'inshingano za Legion ya Mariya.',
        content_fr: 'Comprendre la structure et la mission de la Légion de Marie.',
        level: 'BEGINNER',
        orderIndex: 2,
        durationMin: 7,
      },
    }),
  ]);

  // Create Quizzes
  await Promise.all([
    prisma.quiz.create({
      data: {
        question_en: 'What is the primary mission of the Legion of Mary?',
        question_rw: 'Ni irihe nshingano nyamukuru za Legion ya Mariya?',
        question_fr: 'Quelle est la mission principale de la Légion de Marie?',
        options: JSON.stringify([
          { en: 'Prayer and service', rw: 'Gusenga no gutanga serivisi', fr: 'Prière et service' },
          { en: 'Fundraising', rw: 'Gukusanya amafaranga', fr: 'Collecte de fonds' },
          { en: 'Building churches', rw: 'Kubaka amatorero', fr: 'Construire des églises' },
        ]),
        correctIndex: 0,
        explanation_en: 'The Legion focuses on prayer and apostolic service.',
        explanation_rw: 'Legion yibanda ku gusenga no gutanga serivisi y\'intumwa.',
        explanation_fr: 'La Légion se concentre sur la prière et le service apostolique.',
        lessonId: lessons[1].id,
      },
    }),
  ]);

  // Create Devotions (7 days)
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.devotion.create({
      data: {
        date,
        liturgicalTitle: 'Ordinary Time',
        season: 'Ordinary',
        rank: 'Feria',
        bibleReferences: JSON.stringify([
          { book: 'Matthew', chapter: 5, verses: '1-12' },
        ]),
        title_en: `Daily Reflection - Day ${i + 1}`,
        title_rw: `Gutekereza buri munsi - Umunsi wa ${i + 1}`,
        title_fr: `Réflexion quotidienne - Jour ${i + 1}`,
        message_en: 'God calls us to be light in the world.',
        message_rw: 'Imana iduhamagara kuba umucyo mu isi.',
        message_fr: 'Dieu nous appelle à être lumière dans le monde.',
        prayer_en: 'Lord, help us to shine your light today.',
        prayer_rw: 'Mwami, udufashe kwerekana urumuri rwawe uyu munsi.',
        prayer_fr: 'Seigneur, aide-nous à briller de ta lumière aujourd\'hui.',
        reflection_en: 'How can I be a light to others today?',
        reflection_rw: 'Nshobora gute kuba umucyo ku bandi uyu munsi?',
        reflection_fr: 'Comment puis-je être une lumière pour les autres aujourd\'hui?',
        action_en: 'Perform one act of kindness today.',
        action_rw: 'Kora igikorwa kimwe cy\'ubuntu uyu munsi.',
        action_fr: 'Accomplissez un acte de gentillesse aujourd\'hui.',
        sourceType: 'MANUAL',
        status: 'PUBLISHED',
      },
    });
  }

  // Create Badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name_en: 'First Meeting',
        name_rw: 'Inama ya Mbere',
        name_fr: 'Première Réunion',
        description_en: 'Attended your first group meeting',
        description_rw: 'Witabiriye inama ya mbere y\'itsinda',
        description_fr: 'Assisté à votre première réunion de groupe',
        criteria: JSON.stringify({ type: 'ATTENDANCE_COUNT', value: 1 }),
      },
    }),
    prisma.badge.create({
      data: {
        name_en: '4-Week Streak',
        name_rw: 'Ibyumweru 4 Bikurikirana',
        name_fr: 'Série de 4 Semaines',
        description_en: 'Attended meetings for 4 consecutive weeks',
        description_rw: 'Witabiriye amahugurwa mu byumweru 4 bikurikirana',
        description_fr: 'Assisté aux réunions pendant 4 semaines consécutives',
        criteria: JSON.stringify({ type: 'ATTENDANCE_STREAK', value: 4 }),
      },
    }),
    prisma.badge.create({
      data: {
        name_en: 'Scripture Learner',
        name_rw: 'Uwiga Bibiliya',
        name_fr: 'Apprenant des Écritures',
        description_en: 'Completed 5 formation lessons',
        description_rw: 'Warangije amasomo 5 y\'imyigishirize',
        description_fr: 'Complété 5 leçons de formation',
        criteria: JSON.stringify({ type: 'LESSONS_COMPLETED', value: 5 }),
      },
    }),
  ]);

  // Award first badge to users
  await Promise.all([
    prisma.userBadge.create({
      data: {
        userId: users[2].id,
        badgeId: badges[0].id,
      },
    }),
  ]);

  // Create Events
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  
  await Promise.all([
    prisma.event.create({
      data: {
        title_en: 'Youth Prayer Night',
        title_rw: 'Ijoro ry\'Abakristo b\'Urubyiruko',
        title_fr: 'Nuit de Prière des Jeunes',
        description_en: 'Join us for a night of prayer and worship',
        description_rw: 'Tuza twitabire ijoro ry\'isengesho n\'isengesho',
        description_fr: 'Rejoignez-nous pour une nuit de prière et d\'adoration',
        startDateTime: futureDate,
        endDateTime: new Date(futureDate.getTime() + 3 * 60 * 60 * 1000),
        location: 'St. Michael Parish Hall',
        status: 'PUBLISHED',
        churchId: parishes[0].id,
      },
    }),
  ]);

  // Create Announcements
  await prisma.announcement.create({
    data: {
      title_en: 'Welcome to URUMURI REGIO',
      title_rw: 'Murakaza neza kuri URUMURI REGIO',
      title_fr: 'Bienvenue à URUMURI REGIO',
      body_en: 'We are excited to launch this platform for Catholic youth engagement.',
      body_rw: 'Turishimye gutangiza iyi ntera y\'abakiri b\'urubyiruko ba Gatolika.',
      body_fr: 'Nous sommes ravis de lancer cette plateforme pour l\'engagement des jeunes catholiques.',
      status: 'PUBLISHED',
      churchId: parishes[0].id,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Diocese: 1`);
  console.log(`- Parishes: ${parishes.length}`);
  console.log(`- Legion Hierarchy: 1 Senatus, 1 Regio, ${comitiums.length} Comitiums, ${curias.length} Curias`);
  console.log(`- Groups: ${groups.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Formation Lessons: ${lessons.length}`);
  console.log(`- Devotions: 7 days`);
  console.log(`- Badges: ${badges.length}`);
  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@urumuri.rw / password123');
  console.log('Leader: leader@urumuri.rw / password123');
  console.log('Youth: marie@urumuri.rw / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
