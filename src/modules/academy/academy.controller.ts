import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { CreateQuizDto, UpdateQuizDto } from './dto/quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ApprovalStatus } from '@prisma/client';

@Controller('academy')
export class AcademyController {
    constructor(private readonly academyService: AcademyService) { }

    // --- Courses ---

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Post('courses')
    async createCourse(@Body() createCourseDto: CreateCourseDto, @Request() req: any) {
        return this.academyService.createCourse(createCourseDto, req.user.userId);
    }

    @Get('courses')
    async findAllCourses(@Query('teacherId') teacherId?: string) {
        // Public: only approved & published courses
        // Admin/Teacher: see own drafts
        return this.academyService.findAllCourses({ teacherId });
    }

    @Get('courses/:id')
    async findOneCourse(@Param('id') id: string) {
        return this.academyService.findOneCourse(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Patch('courses/:id')
    async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req: any) {
        const course = await this.academyService.findOneCourse(id);
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this course');
        }
        return this.academyService.updateCourse(id, updateCourseDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch('courses/:id/approve')
    async approveCourse(@Param('id') id: string, @Body('status') status: ApprovalStatus) {
        return this.academyService.approveCourse(id, status);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Delete('courses/:id')
    async deleteCourse(@Param('id') id: string, @Request() req: any) {
        const course = await this.academyService.findOneCourse(id);
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this course');
        }
        return this.academyService.deleteCourse(id);
    }

    // --- Lessons ---

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Post('lessons')
    async createLesson(@Body() createLessonDto: CreateLessonDto, @Request() req: any) {
        const course = await this.academyService.findOneCourse(createLessonDto.courseId);
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to add lessons to this course');
        }
        return this.academyService.createLesson(createLessonDto);
    }

    @Get('lessons/:id')
    async findOneLesson(@Param('id') id: string) {
        return this.academyService.findLesson(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Patch('lessons/:id')
    async updateLesson(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto, @Request() req: any) {
        const lesson = await this.academyService.findLesson(id);
        const course = await this.academyService.findOneCourse(lesson.courseId); // Fetch course via lesson
        // Not optimal query (N+1-ish), but safe
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this lesson');
        }
        return this.academyService.updateLesson(id, updateLessonDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Delete('lessons/:id')
    async deleteLesson(@Param('id') id: string, @Request() req: any) {
        const lesson = await this.academyService.findLesson(id);
        // Again, need to check course ownership
        const course = await this.academyService.findOneCourse(lesson.courseId);
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this lesson');
        }
        return this.academyService.deleteLesson(id);
    }

    // --- Quizzes ---

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Post('quizzes')
    async createQuiz(@Body() createQuizDto: CreateQuizDto, @Request() req: any) {
        const lesson = await this.academyService.findLesson(createQuizDto.lessonId);
        const course = await this.academyService.findOneCourse(lesson.courseId);
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to add quizzes to this course');
        }
        return this.academyService.createQuiz(createQuizDto);
    }

    @Get('lessons/:lessonId/quiz')
    async findQuizByLesson(@Param('lessonId') lessonId: string) {
        return this.academyService.findQuizByLesson(lessonId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER)
    @Patch('quizzes/:id')
    async updateQuiz(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto, @Request() req: any) {
        const quiz = await this.academyService.findQuiz(id);
        const lesson = await this.academyService.findLesson(quiz.lessonId);
        const course = await this.academyService.findOneCourse(lesson.courseId);
        if (course.teacherId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this quiz');
        }
        return this.academyService.updateQuiz(id, updateQuizDto);
    }

    // --- Enrollment & Progress ---

    @UseGuards(JwtAuthGuard)
    @Post('courses/:courseId/enroll')
    async enroll(@Param('courseId') courseId: string, @Request() req: any) {
        return this.academyService.enroll(req.user.userId, courseId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-enrollments')
    async getEnrollments(@Request() req: any) {
        return this.academyService.getEnrollments(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('lessons/:lessonId/complete')
    async completeLesson(@Param('lessonId') lessonId: string, @Request() req: any) {
        return this.academyService.completeLesson(req.user.userId, lessonId);
    }
}
