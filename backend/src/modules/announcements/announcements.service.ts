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
        church: { select: { name_en: true, name_rw: true, name_fr: true } },
        group: { select: { name_en: true, name_rw: true, name_fr: true } },
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
        group: true,
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

  async create(dto: CreateAnnouncementDto, createdBy: string) {
    return this.prisma.announcement.create({
      data: {
        ...dto,
        createdBy,
      },
      include: {
        church: true,
        group: true,
      },
    });
  }
}
