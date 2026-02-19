import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { CreateQuizDto, UpdateQuizDto } from './dto/quiz.dto';
import { PublishStatus, ApprovalStatus, Prisma, Course, Lesson, Quiz, Enrollment, LessonProgress, Certificate } from '@prisma/client';

@Injectable()
export class AcademyService {
    constructor(private prisma: PrismaService) { }

    // --- Courses ---

    async createCourse(data: CreateCourseDto, teacherId: string): Promise<Course> {
        return this.prisma.course.create({
            data: {
                ...data,
                teacherId,
                status: data.status || PublishStatus.DRAFT,
                approvalStatus: ApprovalStatus.PENDING,
            },
        });
    }

    async findAllCourses(query?: { teacherId?: string; status?: PublishStatus; approved?: boolean }): Promise<Course[]> {
        const where: Prisma.CourseWhereInput = {};

        if (query?.teacherId) {
            where.teacherId = query.teacherId;
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.approved !== undefined) {
            where.approvalStatus = query.approved ? ApprovalStatus.APPROVED : undefined;
        }

        return this.prisma.course.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                teacher: {
                    select: { id: true, displayName: true },
                },
                _count: {
                    select: { lessons: true, enrollments: true },
                },
            },
        });
    }

    async findOneCourse(id: string): Promise<Course> {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: { id: true, displayName: true, email: true },
                },
                lessons: {
                    orderBy: { orderIndex: 'asc' },
                },
            },
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    async updateCourse(id: string, data: UpdateCourseDto): Promise<Course> {
        await this.findOneCourse(id);
        return this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async approveCourse(id: string, status: ApprovalStatus): Promise<Course> {
        await this.findOneCourse(id);
        return this.prisma.course.update({
            where: { id },
            data: { approvalStatus: status },
        });
    }

    async deleteCourse(id: string): Promise<Course> {
        return this.prisma.course.delete({ where: { id } });
    }

    // --- Lessons ---

    async createLesson(data: CreateLessonDto): Promise<Lesson> {
        const course = await this.findOneCourse(data.courseId);
        // Could check authorization here or in controller
        return this.prisma.lesson.create({
            data,
        });
    }

    async findLesson(id: string): Promise<Lesson> {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                course: {
                    select: { id: true, title: true, teacherId: true }
                }
            }
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }

    async updateLesson(id: string, data: UpdateLessonDto): Promise<Lesson> {
        await this.findLesson(id);
        return this.prisma.lesson.update({
            where: { id },
            data,
        });
    }

    async deleteLesson(id: string): Promise<Lesson> {
        return this.prisma.lesson.delete({ where: { id } });
    }

    // --- Quizzes ---

    async createQuiz(data: CreateQuizDto): Promise<Quiz> {
        // Ideally ensure only 1 quiz per lesson or handle multiple
        return this.prisma.quiz.create({
            data,
        });
    }

    async findQuizByLesson(lessonId: string): Promise<Quiz | null> {
        return this.prisma.quiz.findFirst({ // Assuming 1 quiz per lesson for now
            where: { lessonId },
        });
    }

    async findQuiz(id: string): Promise<Quiz> {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        return quiz;
    }

    async updateQuiz(id: string, data: UpdateQuizDto): Promise<Quiz> {
        await this.findQuiz(id);
        return this.prisma.quiz.update({
            where: { id },
            data
        });
    }

    // --- Enrollment & Progress ---

    async enroll(userId: string, courseId: string): Promise<Enrollment> {
        const existing = await this.prisma.enrollment.findFirst({
            where: { userId, courseId }
        });
        if (existing) return existing;

        return this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
                progressPercent: 0
            }
        });
    }

    async getEnrollments(userId: string): Promise<Enrollment[]> {
        return this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: { id: true, title: true, coverImageUrl: true, teacher: { select: { displayName: true } } }
                }
            }
        });
    }

    async completeLesson(userId: string, lessonId: string): Promise<{ enrollment: Enrollment, certificate?: Certificate }> {
        const lesson = await this.findLesson(lessonId);

        // Check if enrolled
        const enrollment = await this.prisma.enrollment.findFirst({
            where: { userId, courseId: lesson.courseId }
        });
        if (!enrollment) {
            throw new NotFoundException('User not enrolled in this course');
        }

        // Mark lesson as complete
        await this.prisma.lessonProgress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            create: { userId, lessonId, completedAt: new Date() },
            update: { completedAt: new Date() },
        });

        // Calculate progress
        const totalLessons = await this.prisma.lesson.count({ where: { courseId: lesson.courseId } });
        const completedLessons = await this.prisma.lessonProgress.count({
            where: {
                userId,
                lesson: { courseId: lesson.courseId },
                completedAt: { not: null }
            }
        });

        const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        // Update enrollment
        const updatedEnrollment = await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                progressPercent,
                completedAt: progressPercent === 100 ? new Date() : null
            }
        });

        let certificate: Certificate | undefined;
        if (progressPercent === 100 && !enrollment.completedAt) {
            // Generate certificate
            certificate = await this.prisma.certificate.create({
                data: {
                    userId,
                    courseId: lesson.courseId,
                    certificateUrl: `https://urumuri.rw/certificates/${userId}/${lesson.courseId}` // Stub URL
                }
            });
        }

        async verifyCertificate(code: string): Promise < any > {
            const certificate = await this.prisma.certificate.findUnique({
                where: { certificateCode: code },
                include: {
                    user: { select: { displayName: true } },
                    course: { select: { title: true } }
                }
            });
            if(!certificate) {
                throw new NotFoundException(`Certificate with code ${code} not found`);
            }
        return certificate;
        }
    }
