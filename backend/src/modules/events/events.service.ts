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
      where.startDateTime = { gte: new Date() };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        church: { select: { name_en: true, name_rw: true, name_fr: true } },
        group: { select: { name_en: true, name_rw: true, name_fr: true } },
      },
      orderBy: { startDateTime: upcoming ? 'asc' : 'desc' },
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
    return this.prisma.event.create({
      data: {
        title_en: dto.title_en,
        title_rw: dto.title_rw,
        title_fr: dto.title_fr,
        description_en: dto.description_en,
        description_rw: dto.description_rw,
        description_fr: dto.description_fr,
        startDateTime: new Date(dto.startTime),
        endDateTime: new Date(dto.endTime),
        location: dto.location,
        churchId: dto.churchId,
        groupId: dto.groupId,
        status: 'PUBLISHED',
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
              { startDateTime: { lte: start } },
              { endDateTime: { gte: start } },
            ],
          },
          {
            AND: [
              { startDateTime: { lte: end } },
              { endDateTime: { gte: end } },
            ],
          },
          {
            AND: [
              { startDateTime: { gte: start } },
              { endDateTime: { lte: end } },
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
