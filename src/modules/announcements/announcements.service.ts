import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';
import { PublishStatus, Prisma, Announcement } from '@prisma/client';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateAnnouncementDto): Promise<Announcement> {
        return this.prisma.announcement.create({
            data: {
                ...data,
                status: data.status || PublishStatus.DRAFT,
            },
        });
    }

    async findAll(query?: { churchId?: string }): Promise<Announcement[]> {
        const where: Prisma.AnnouncementWhereInput = {
            status: PublishStatus.PUBLISHED,
            startVisible: { lte: new Date() },
            endVisible: { gte: new Date() },
        };
        if (query?.churchId) {
            where.churchId = query.churchId;
        }

        return this.prisma.announcement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                church: {
                    select: { id: true, name: true, logoUrl: true },
                },
            },
        });
    }

    async findOne(id: string): Promise<Announcement> {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
            include: {
                church: true,
            },
        });
        if (!announcement) {
            throw new NotFoundException(`Announcement with ID ${id} not found`);
        }
        return announcement;
    }

    async update(id: string, data: UpdateAnnouncementDto): Promise<Announcement> {
        await this.findOne(id);
        return this.prisma.announcement.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Announcement> {
        return this.prisma.announcement.delete({
            where: { id },
        });
    }
}
