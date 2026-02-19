import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDevotionDto, UpdateDevotionDto } from './dto/devotion.dto';
import { PublishStatus, Prisma, Devotion } from '@prisma/client';

@Injectable()
export class DevotionsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateDevotionDto, authorId: string): Promise<Devotion> {
        return this.prisma.devotion.create({
            data: {
                ...data,
                authorId,
                status: data.status || PublishStatus.DRAFT,
            },
        });
    }

    async findAll(query?: { language?: string; month?: string; year?: string; take?: number }): Promise<Devotion[]> {
        const where: Prisma.DevotionWhereInput = {
            status: PublishStatus.PUBLISHED,
            date: { lte: new Date() },
        };

        return this.prisma.devotion.findMany({
            where,
            orderBy: { date: 'desc' },
            take: query?.take || 30,
        });
    }

    async findLatest(take: number = 7): Promise<Devotion[]> {
        return this.prisma.devotion.findMany({
            where: { status: PublishStatus.PUBLISHED, date: { lte: new Date() } },
            orderBy: { date: 'desc' },
            take,
        });
    }

    async findToday(): Promise<Devotion | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.prisma.devotion.findFirst({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
                status: PublishStatus.PUBLISHED,
            },
        });
    }

    async findOne(id: string): Promise<Devotion> {
        const devotion = await this.prisma.devotion.findUnique({
            where: { id },
        });
        if (!devotion) {
            throw new NotFoundException(`Devotion with ID ${id} not found`);
        }
        return devotion;
    }

    async update(id: string, data: UpdateDevotionDto): Promise<Devotion> {
        await this.findOne(id);
        return this.prisma.devotion.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Devotion> {
        return this.prisma.devotion.delete({
            where: { id },
        });
    }
}
