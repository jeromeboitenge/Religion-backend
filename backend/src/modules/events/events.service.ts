import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(churchId?: string, upcoming: boolean = false) {
    const where: any = {};
    
    if (churchId) where.churchId = churchId;
    if (upcoming) {
      where.startTime = { gte: new Date() };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        church: { select: { name_en: true, name_rw: true, name_fr: true } },
        group: { select: { name_en: true, name_rw: true, name_fr: true } },
      },
      orderBy: { startTime: upcoming ? 'asc' : 'desc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        church: true,
        group: true,
      },
    });

    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto, createdBy: string) {
    const conflicts = await this.checkConflicts(dto.churchId, dto.startTime, dto.endTime);
    
    return this.prisma.event.create({
      data: {
        ...dto,
        createdBy,
        hasConflict: conflicts.length > 0,
      },
      include: {
        church: true,
        group: true,
      },
    });
  }

  async checkConflicts(churchId: string, startTime: string, endTime: string) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    return this.prisma.event.findMany({
      where: {
        churchId,
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gte: start } },
            ],
          },
          {
            AND: [
              { startTime: { lte: end } },
              { endTime: { gte: end } },
            ],
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } },
            ],
          },
        ],
      },
      include: {
        group: { select: { name_en: true } },
      },
    });
  }
}
