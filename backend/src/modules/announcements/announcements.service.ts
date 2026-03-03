import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(churchId?: string, groupId?: string) {
    const where: any = {};
    
    if (churchId) where.churchId = churchId;
    if (groupId) where.groupId = groupId;

    return this.prisma.announcement.findMany({
      where,
      include: {
        church: { select: { name: true } },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        church: true,
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }

  async create(dto: CreateAnnouncementDto, userId: string) {
    return this.prisma.announcement.create({
      data: {
        churchId: dto.churchId,
        title_en: dto.title_en,
        title_rw: dto.title_rw,
        title_fr: dto.title_fr,
        content_en: dto.content_en,
        content_rw: dto.content_rw,
        content_fr: dto.content_fr,
        priority: dto.priority,
        userId,
      },
      include: {
        church: true,
      },
    });
  }
}
