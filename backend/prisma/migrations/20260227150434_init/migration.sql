-- CreateEnum
CREATE TYPE "Role" AS ENUM ('YOUTH_USER', 'GROUP_MEMBER', 'GROUP_LEADER', 'SECRETARY', 'TREASURER', 'PARISH_ADMIN', 'COUNCIL_ADMIN', 'MODERATOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'RW', 'FR');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('LEGION_PRAESIDIUM', 'CHARISMATIC', 'CATHOLIC_ACTION', 'YOUTH_GROUP', 'CHOIR', 'SCC', 'OTHER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'AUXILIARY');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('MEMBER', 'LEADER', 'SECRETARY', 'TREASURER', 'SPIRITUAL_DIRECTOR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "FormationLevel" AS ENUM ('BEGINNER', 'GROWING', 'SERVING', 'LEADERSHIP');

-- CreateEnum
CREATE TYPE "DevotionSourceType" AS ENUM ('AUTO_CATHOLIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "ThreadCategory" AS ENUM ('PRAYER_REQUEST', 'MEETING_DISCUSSION', 'FORMATION_QUESTION', 'SERVICE_PLANNING', 'ENCOURAGEMENT');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('AMEN', 'PRAYING', 'THANK_YOU', 'WELL_DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "district" TEXT,
    "sector" TEXT,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "role" "Role" NOT NULL DEFAULT 'YOUTH_USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "primaryChurchId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diocese" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diocese_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Church" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "sector" TEXT,
    "address" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dioceseId" TEXT NOT NULL,

    CONSTRAINT "Church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Senatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dioceseId" TEXT NOT NULL,

    CONSTRAINT "Senatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regio" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senatusId" TEXT,

    CONSTRAINT "Regio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comitium" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regioId" TEXT NOT NULL,

    CONSTRAINT "Comitium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curia" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comitiumId" TEXT NOT NULL,

    CONSTRAINT "Curia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Praesidium" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "curiaId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Praesidium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GroupType" NOT NULL,
    "description" TEXT,
    "meetingDay" TEXT,
    "meetingTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "churchId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL DEFAULT 'MANUAL',
    "userId" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingMinutes" (
    "id" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "content_rw" TEXT,
    "content_fr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "meetingId" TEXT NOT NULL,

    CONSTRAINT "MeetingMinutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary_en" TEXT NOT NULL,
    "summary_rw" TEXT,
    "summary_fr" TEXT,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WorkReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceEntry" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "FollowUpTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_rw" TEXT,
    "title_fr" TEXT,
    "description_en" TEXT,
    "description_rw" TEXT,
    "description_fr" TEXT,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "churchId" TEXT,
    "groupId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_rw" TEXT,
    "title_fr" TEXT,
    "body_en" TEXT NOT NULL,
    "body_rw" TEXT,
    "body_fr" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "churchId" TEXT NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormationLesson" (
    "id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_rw" TEXT,
    "title_fr" TEXT,
    "content_en" TEXT NOT NULL,
    "content_rw" TEXT,
    "content_fr" TEXT,
    "level" "FormationLevel" NOT NULL DEFAULT 'BEGINNER',
    "orderIndex" INTEGER NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormationLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "question_en" TEXT NOT NULL,
    "question_rw" TEXT,
    "question_fr" TEXT,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation_en" TEXT,
    "explanation_rw" TEXT,
    "explanation_fr" TEXT,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "selectedIndex" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devotion" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "liturgicalTitle" TEXT,
    "season" TEXT,
    "rank" TEXT,
    "bibleReferences" JSONB NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_rw" TEXT NOT NULL,
    "title_fr" TEXT NOT NULL,
    "message_en" TEXT NOT NULL,
    "message_rw" TEXT NOT NULL,
    "message_fr" TEXT NOT NULL,
    "prayer_en" TEXT NOT NULL,
    "prayer_rw" TEXT NOT NULL,
    "prayer_fr" TEXT NOT NULL,
    "reflection_en" TEXT NOT NULL,
    "reflection_rw" TEXT NOT NULL,
    "reflection_fr" TEXT NOT NULL,
    "action_en" TEXT NOT NULL,
    "action_rw" TEXT NOT NULL,
    "action_fr" TEXT NOT NULL,
    "sourceType" "DevotionSourceType" NOT NULL DEFAULT 'MANUAL',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Devotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_rw" TEXT,
    "name_fr" TEXT,
    "description_en" TEXT NOT NULL,
    "description_rw" TEXT,
    "description_fr" TEXT,
    "iconUrl" TEXT,
    "criteria" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationThread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ThreadCategory" NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ConversationThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reactions" JSONB,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReport" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporterId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "MessageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedById" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Diocese_name_key" ON "Diocese"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Praesidium_groupId_key" ON "Praesidium"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_groupId_key" ON "Membership"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_meetingId_key" ON "Attendance"("userId", "meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingMinutes_meetingId_key" ON "MeetingMinutes"("meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "Devotion_date_key" ON "Devotion"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "DirectMessage_senderId_receiverId_idx" ON "DirectMessage"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_primaryChurchId_fkey" FOREIGN KEY ("primaryChurchId") REFERENCES "Church"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Church" ADD CONSTRAINT "Church_dioceseId_fkey" FOREIGN KEY ("dioceseId") REFERENCES "Diocese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Senatus" ADD CONSTRAINT "Senatus_dioceseId_fkey" FOREIGN KEY ("dioceseId") REFERENCES "Diocese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regio" ADD CONSTRAINT "Regio_senatusId_fkey" FOREIGN KEY ("senatusId") REFERENCES "Senatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comitium" ADD CONSTRAINT "Comitium_regioId_fkey" FOREIGN KEY ("regioId") REFERENCES "Regio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curia" ADD CONSTRAINT "Curia_comitiumId_fkey" FOREIGN KEY ("comitiumId") REFERENCES "Comitium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Praesidium" ADD CONSTRAINT "Praesidium_curiaId_fkey" FOREIGN KEY ("curiaId") REFERENCES "Curia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Praesidium" ADD CONSTRAINT "Praesidium_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingMinutes" ADD CONSTRAINT "MeetingMinutes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkReport" ADD CONSTRAINT "WorkReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceEntry" ADD CONSTRAINT "FinanceEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpTask" ADD CONSTRAINT "FollowUpTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpTask" ADD CONSTRAINT "FollowUpTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "FormationLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationThread" ADD CONSTRAINT "ConversationThread_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationThread" ADD CONSTRAINT "ConversationThread_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ConversationThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReport" ADD CONSTRAINT "MessageReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
