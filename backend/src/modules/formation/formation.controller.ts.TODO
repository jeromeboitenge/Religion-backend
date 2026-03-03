import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FormationService } from './formation.service';
import { QuizAttemptDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('formation')
@Controller('formation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FormationController {
  constructor(private readonly formationService: FormationService) {}

  @Get('lessons')
  @ApiOperation({ summary: 'Get all formation lessons' })
  getLessons() {
    return this.formationService.getLessons();
  }

  @Get('lessons/:id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  getLesson(@Param('id') id: string) {
    return this.formationService.getLesson(id);
  }

  @Get('quizzes/:id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  getQuiz(@Param('id') id: string) {
    return this.formationService.getQuiz(id);
  }

  @Post('quizzes/:id/attempt')
  @ApiOperation({ summary: 'Submit quiz attempt' })
  submitQuiz(@Param('id') id: string, @Body() dto: QuizAttemptDto, @Request() req) {
    return this.formationService.submitQuiz(id, req.user.userId, dto);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get user formation progress' })
  getProgress(@Request() req) {
    return this.formationService.getProgress(req.user.userId);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get available badges' })
  getBadges() {
    return this.formationService.getBadges();
  }

  @Get('my-badges')
  @ApiOperation({ summary: 'Get user badges' })
  getMyBadges(@Request() req) {
    return this.formationService.getUserBadges(req.user.userId);
  }
}
