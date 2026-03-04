import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(churchId?: string, groupId?: string) {
    const where: any = {};
    
    if (churchId) where.churchId = churchId;

    return this.prisma.announcement.findMany({
      where,
      include: {
        church: { select: { name_en: true, name_rw: true, name_fr: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        church: true,
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
        body_en: dto.content_en,
        body_rw: dto.content_rw,
        body_fr: dto.content_fr,
        status: 'PUBLISHED',
      },
      include: {
        church: true,
      },
    });
  }
}
