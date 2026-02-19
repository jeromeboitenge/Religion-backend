import { PrismaClient, Role, UserStatus, PublishStatus, OrganizationStatus, VerificationStatus, MediaType, Language, CourseLevel, ApprovalStatus, PostCategory, ReactionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // correct order: child tables first
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.moderationAction.deleteMany();
    await prisma.report.deleteMany();
    await prisma.reaction.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.devotion.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.event.deleteMany();
    await prisma.sermon.deleteMany();

    // Update users to remove church references before deleting churches
    await prisma.user.updateMany({ data: { churchId: null } });

    await prisma.church.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    console.log('Cleaned database.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // --- Organizations ---
    const orgsData = [
        { name: 'Catholic Church', description: 'The Roman Catholic Church in Rwanda' },
        { name: 'Protestant Council', description: 'Council of Protestant Churches in Rwanda' },
        { name: 'Seventh-day Adventist', description: 'SDA Church in Rwanda' },
    ];

    const orgs = [];
    for (const o of orgsData) {
        const org = await prisma.organization.create({
            data: {
                name: o.name,
                description: o.description,
                status: OrganizationStatus.ACTIVE,
            }
        });
        orgs.push(org);
        console.log(`Created Organization: ${org.name}`);
    }

    // --- Churches ---
    const churches = [];
    for (const org of orgs) {
        for (let i = 1; i <= 3; i++) {
            const church = await prisma.church.create({
                data: {
                    name: `${org.name} - Parish ${i}`,
                    district: 'Kigali',
                    organizationId: org.id,
                    verificationStatus: VerificationStatus.VERIFIED,
                    description: `A vibrant community in ${org.name}`,
                    serviceTimes: { sunday: "09:00 AM - 11:00 AM", wednesday: "06:00 PM - 08:00 PM" }
                }
            });
            churches.push(church);
            console.log(`Created Church: ${church.name}`);
        }
    }

    // --- Users ---

    // Super Admin
    const superAdmin = await prisma.user.create({
        data: {
            email: 'superadmin@urumuri.rw',
            password: hashedPassword,
            displayName: 'Super Admin',
            role: Role.SUPER_ADMIN,
            status: UserStatus.ACTIVE,
        }
    });
    console.log('Created Super Admin');

    // Church Admins (2)
    const churchAdmin1 = await prisma.user.create({
        data: {
            email: 'admin1@church.rw',
            password: hashedPassword,
            displayName: 'Church Admin 1',
            role: Role.CHURCH_ADMIN,
            status: UserStatus.ACTIVE,
            churchId: churches[0].id
        }
    });

    const churchAdmin2 = await prisma.user.create({
        data: {
            email: 'admin2@church.rw',
            password: hashedPassword,
            displayName: 'Church Admin 2',
            role: Role.CHURCH_ADMIN,
            status: UserStatus.ACTIVE,
            churchId: churches[1].id
        }
    });
    console.log('Created Church Admins');

    // Teacher
    const teacher = await prisma.user.create({
        data: {
            email: 'teacher@academy.rw',
            password: hashedPassword,
            displayName: 'Bible Teacher',
            role: Role.TEACHER,
            status: UserStatus.ACTIVE
        }
    });
    console.log('Created Teacher');

    // Users (5)
    for (let i = 1; i <= 5; i++) {
        await prisma.user.create({
            data: {
                email: `user${i}@urumuri.rw`,
                password: hashedPassword,
                displayName: `User ${i}`,
                role: Role.USER,
                status: UserStatus.ACTIVE,
                churchId: i % 2 === 0 ? churches[0].id : undefined // Some belong to church
            }
        });
    }
    console.log('Created Users');

    // --- Content ---

    // Devotions (7)
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i); // Past 7 days
        await prisma.devotion.create({
            data: {
                title: `Daily Devotion ${i + 1}`,
                bibleReference: 'John 3:16',
                verseText: 'For God so loved the world...',
                content: 'A reflection on God\'s love...',
                date: date,
                status: PublishStatus.PUBLISHED,
                language: Language.EN
            }
        });
    }
    console.log('Created Devotions');

    // Sermons
    await prisma.sermon.create({
        data: {
            title: 'Sunday Service: Faith',
            churchId: churches[0].id,
            mediaType: MediaType.VIDEO,
            mediaUrl: 'https://youtube.com/watch?v=example',
            status: PublishStatus.PUBLISHED,
            language: Language.EN
        }
    });

    // Events
    await prisma.event.create({
        data: {
            title: 'Youth Conference',
            churchId: churches[0].id,
            startDateTime: new Date(Date.now() + 86400000 * 5), // +5 days
            endDateTime: new Date(Date.now() + 86400000 * 5 + 7200000), // +2 hours
            status: PublishStatus.PUBLISHED,
            location: 'Main Hall'
        }
    });

    // Courses
    const course = await prisma.course.create({
        data: {
            title: 'Foundations of Faith',
            description: 'Basic christian beliefs',
            level: CourseLevel.BEGINNER,
            teacherId: teacher.id,
            status: PublishStatus.PUBLISHED,
            approvalStatus: ApprovalStatus.APPROVED
        }
    });

    await prisma.lesson.create({
        data: {
            title: 'What is Faith?',
            content: 'Faith is...',
            orderIndex: 1,
            courseId: course.id,
        }
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
