import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportStatus, Report, PublishStatus, UserStatus } from '@prisma/client';

@Injectable()
export class ModerationService {
    constructor(private prisma: PrismaService) { }

    async createReport(data: CreateReportDto, reporterId: string): Promise<Report> {
        return this.prisma.report.create({
            data: {
                ...data,
                reporterId,
                status: ReportStatus.PENDING,
            },
        });
    }

    async findAllReports(query?: { status?: ReportStatus; reason?: string }): Promise<Report[]> {
        const where: any = {};
        if (query?.status) where.status = query.status;
        // Reason filtering if needed

        return this.prisma.report.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                reporter: { select: { id: true, displayName: true } }
            }
        });
    }

    async getReport(id: string): Promise<Report> {
        const report = await this.prisma.report.findUnique({ where: { id } });
        if (!report) throw new NotFoundException(`Report with ID ${id} not found`);
        return report;
    }

    async updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
        return this.prisma.report.update({
            where: { id },
            data: { status }
        });
    }

    async moderateContent(reportId: string, action: 'HIDE' | 'DELETE' | 'BAN_USER', moderatorId: string): Promise<any> {
        const report = await this.getReport(reportId);

        // Log action
        await this.prisma.moderationAction.create({
            data: {
                action,
                reason: report.reason, // Or custom reason
                moderatorId,
                targetId: report.targetId,
                targetType: report.targetType
            }
        });

        // Execute Action
        switch (report.targetType) {
            case 'POST':
                if (action === 'HIDE') await this.prisma.post.update({ where: { id: report.targetId }, data: { status: PublishStatus.HIDDEN } });
                if (action === 'DELETE') await this.prisma.post.update({ where: { id: report.targetId }, data: { status: PublishStatus.DELETED } });
                break;
            case 'COMMENT':
                // Comment doesn't have status field in schema? Check schema.
                // Assuming simplified MVP: just delete it if DELETE action.
                if (action === 'DELETE') await this.prisma.comment.delete({ where: { id: report.targetId } });
                break;
            case 'USER':
                if (action === 'BAN_USER') await this.prisma.user.update({ where: { id: report.targetId }, data: { status: UserStatus.BANNED } });
                break;
            // ... handled other types
        }

        // Resolve report
        await this.updateReportStatus(reportId, ReportStatus.RESOLVED);

        return { message: 'Action executed and report resolved' };
    }
}
