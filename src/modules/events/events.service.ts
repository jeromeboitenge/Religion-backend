import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { PublishStatus, Prisma, Event } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateEventDto): Promise<Event> {
        return this.prisma.event.create({
            data: {
                ...data,
                status: data.status || PublishStatus.DRAFT,
            },
        });
    }

    async findAll(query?: { churchId?: string; district?: string }): Promise<Event[]> {
        const where: Prisma.EventWhereInput = {
            status: PublishStatus.PUBLISHED,
        };
        if (query?.churchId) {
            where.churchId = query.churchId;
        }
        if (query?.district) {
            where.district = { contains: query.district, mode: 'insensitive' };
        }

        return this.prisma.event.findMany({
            where,
            orderBy: { startDateTime: 'asc' },
            include: {
                church: {
                    select: { id: true, name: true, logoUrl: true },
                },
            },
        });
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                church: true,
            },
        });
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: string, data: UpdateEventDto): Promise<Event> {
        await this.findOne(id);
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Event> {
        return this.prisma.event.delete({
            where: { id },
        });
    }
}
