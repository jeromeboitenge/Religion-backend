import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto, CheckInDto, MeetingMinutesDto } from './dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(groupId: string, upcoming: boolean = false) {
    const where: any = { groupId };
    
    if (upcoming) {
      where.scheduledAt = { gte: new Date() };
    }

    return this.prisma.meeting.findMany({
      where,
      include: {
        group: { select: { name_en: true, name_rw: true, name_fr: true } },
        _count: { select: { attendance: true } },
      },
      orderBy: { scheduledAt: upcoming ? 'asc' : 'desc' },
    });
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        group: true,
        attendance: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) throw new NotFoundException('Meeting not found');
    return meeting;
  }

  async create(dto: CreateMeetingDto, createdBy: string) {
    const qrCode = `MEETING_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return this.prisma.meeting.create({
      data: {
        ...dto,
        qrCode,
        createdBy,
      },
      include: {
        group: true,
      },
    });
  }

  async checkIn(meetingId: string, userId: string, dto: CheckInDto) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) throw new NotFoundException('Meeting not found');

    if (dto.qrCode && dto.qrCode !== meeting.qrCode) {
      throw new BadRequestException('Invalid QR code');
    }

    const existing = await this.prisma.attendance.findUnique({
      where: {
        userId_meetingId: { userId, meetingId },
      },
    });

    if (existing) {
      throw new BadRequestException('Already checked in');
    }

    return this.prisma.attendance.create({
      data: {
        userId,
        meetingId,
        status: 'PRESENT',
        checkedInAt: new Date(),
      },
    });
  }

  async getAttendance(meetingId: string) {
    return this.prisma.attendance.findMany({
      where: { meetingId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { checkedInAt: 'asc' },
    });
  }

  async addMinutes(meetingId: string, dto: MeetingMinutesDto) {
    return this.prisma.meeting.update({
      where: { id: meetingId },
      data: {
        minutes_en: dto.minutes_en,
        minutes_rw: dto.minutes_rw,
        minutes_fr: dto.minutes_fr,
      },
    });
  }

  async getUserHistory(userId: string, groupId?: string) {
    const where: any = { userId };
    if (groupId) {
      where.meeting = { groupId };
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        meeting: {
          include: {
            group: {
              select: { name_en: true, name_rw: true, name_fr: true },
            },
          },
        },
      },
      orderBy: { meeting: { scheduledAt: 'desc' } },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    timeZone: 'Africa/Kigali',
  })
  async checkAbsences() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const recentMeetings = await this.prisma.meeting.findMany({
      where: {
        scheduledAt: { gte: twoDaysAgo },
      },
      include: {
        group: {
          include: {
            memberships: {
              where: { status: 'ACTIVE' },
              select: { userId: true },
            },
          },
        },
        attendance: {
          select: { userId: true },
        },
      },
    });

    for (const meeting of recentMeetings) {
      const attendedUserIds = meeting.attendance.map((a) => a.userId);
      const allMemberIds = meeting.group.memberships.map((m) => m.userId);
      const absentUserIds = allMemberIds.filter((id) => !attendedUserIds.includes(id));

      for (const userId of absentUserIds) {
        const recentAbsences = await this.prisma.attendance.count({
          where: {
            userId,
            status: 'ABSENT',
            meeting: {
              groupId: meeting.groupId,
              scheduledAt: { gte: twoDaysAgo },
            },
          },
        });

        if (recentAbsences >= 2) {
          await this.prisma.followUpTask.create({
            data: {
              userId,
              groupId: meeting.groupId,
              type: 'ABSENCE_FOLLOWUP',
              description: `Member absent from ${recentAbsences} recent meetings`,
              status: 'PENDING',
            },
          });
        }
      }
    }
  }
}
