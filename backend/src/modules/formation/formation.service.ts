import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuizAttemptDto } from './dto';

@Injectable()
export class FormationService {
  constructor(private prisma: PrismaService) {}

  async getLessons() {
    return this.prisma.formationLesson.findMany({
      include: {
        quiz: {
          select: {
            id: true,
            passingScore: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async getLesson(id: string) {
    const lesson = await this.prisma.formationLesson.findUnique({
      where: { id },
      include: {
        quiz: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async getQuiz(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          select: {
            title_en: true,
            title_rw: true,
            title_fr: true,
          },
        },
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async submitQuiz(quizId: string, userId: string, dto: QuizAttemptDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    const questions = quiz.questions as any[];
    const answers = dto.answers;

    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        answers: JSON.stringify(answers),
        score,
        passed,
      },
    });

    if (passed) {
      await this.checkAndAwardBadges(userId);
    }

    return attempt;
  }

  async getProgress(userId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, passed: true },
      include: {
        quiz: {
          include: {
            lesson: {
              select: {
                id: true,
                title_en: true,
                level: true,
              },
            },
          },
        },
      },
    });

    const completedLessons = attempts.map((a) => a.quiz.lesson);
    const uniqueLessons = Array.from(new Map(completedLessons.map((l) => [l.id, l])).values());

    const levels = ['BEGINNER', 'GROWING', 'SERVING', 'LEADERSHIP'];
    let currentLevel = 'BEGINNER';

    for (const level of levels) {
      const levelLessons = uniqueLessons.filter((l) => l.level === level);
      if (levelLessons.length >= 3) {
        currentLevel = level;
      }
    }

    return {
      currentLevel,
      completedLessons: uniqueLessons.length,
      totalAttempts: attempts.length,
      averageScore: attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length || 0,
    };
  }

  async getBadges() {
    return this.prisma.badge.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  private async checkAndAwardBadges(userId: string) {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const earnedBadgeIds = userBadges.map((ub) => ub.badgeId);

    const passedQuizzes = await this.prisma.quizAttempt.count({
      where: { userId, passed: true },
    });

    const badges = await this.prisma.badge.findMany();

    for (const badge of badges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      let shouldAward = false;

      if (badge.criteria_en.includes('first quiz') && passedQuizzes >= 1) {
        shouldAward = true;
      } else if (badge.criteria_en.includes('5 lessons') && passedQuizzes >= 5) {
        shouldAward = true;
      }

      if (shouldAward) {
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
      }
    }
  }
}
