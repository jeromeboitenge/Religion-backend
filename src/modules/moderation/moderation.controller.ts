import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ReportStatus } from '@prisma/client';

@Controller('moderation')
export class ModerationController {
    constructor(private readonly moderationService: ModerationService) { }

    @UseGuards(JwtAuthGuard)
    @Post('report')
    async createReport(@Body() createReportDto: CreateReportDto, @Request() req: any) {
        return this.moderationService.createReport(createReportDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.MODERATOR)
    @Get('reports')
    async findAllReports(@Query('status') status?: ReportStatus) {
        return this.moderationService.findAllReports({ status });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.MODERATOR)
    @Patch('reports/:id/status')
    async updateReportStatus(@Param('id') id: string, @Body('status') status: ReportStatus) {
        return this.moderationService.updateReportStatus(id, status);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.MODERATOR)
    @Post('reports/:id/action')
    async moderateContent(@Param('id') id: string, @Body('action') action: 'HIDE' | 'DELETE' | 'BAN_USER', @Request() req: any) {
        return this.moderationService.moderateContent(id, action, req.user.userId);
    }
}
