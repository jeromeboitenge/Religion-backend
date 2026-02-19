import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSermonDto, UpdateSermonDto } from './dto/sermon.dto';
import { PublishStatus, Prisma, Sermon } from '@prisma/client';

@Injectable()
export class SermonsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateSermonDto): Promise<Sermon> {
        return this.prisma.sermon.create({
            data: {
                ...data,
                status: data.status || PublishStatus.DRAFT,
            },
        });
    }

    async findAll(query?: { churchId?: string; language?: string; tags?: string[] }): Promise<Sermon[]> {
        const where: Prisma.SermonWhereInput = {
            status: PublishStatus.PUBLISHED,
        };
        if (query?.churchId) {
            where.churchId = query.churchId;
        }
        // Language filtering if needed
        // Tags filtering logic (array contains)

        return this.prisma.sermon.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                church: {
                    select: { id: true, name: true, logoUrl: true },
                },
            },
        });
    }

    // Admin method to see all (drafts included)
    async findAllByChurch(churchId: string): Promise<Sermon[]> {
        return this.prisma.sermon.findMany({
            where: { churchId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Sermon> {
        const sermon = await this.prisma.sermon.findUnique({
            where: { id },
            include: {
                church: true,
            },
        });
        if (!sermon) {
            throw new NotFoundException(`Sermon with ID ${id} not found`);
        }
        return sermon;
    }

    async update(id: string, data: UpdateSermonDto): Promise<Sermon> {
        await this.findOne(id);
        return this.prisma.sermon.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Sermon> {
        return this.prisma.sermon.delete({
            where: { id },
        });
    }

    async incrementViewCount(id: string): Promise<Sermon> {
        return this.prisma.sermon.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
}
