import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, JoinGroupDto, UpdateMembershipDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { churchId?: string; type?: string; search?: string }) {
    const where: any = {};
    
    if (filters.churchId) where.churchId = filters.churchId;
    if (filters.type) where.type = filters.type;
    if (filters.search) {
      where.OR = [
        { name_en: { contains: filters.search, mode: 'insensitive' } },
        { name_rw: { contains: filters.search, mode: 'insensitive' } },
        { name_fr: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.group.findMany({
      where,
      include: {
        church: { select: { name_en: true, name_rw: true, name_fr: true } },
        _count: { select: { memberships: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        church: true,
        councilHierarchy: true,
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async getUserGroups(userId: string) {
    return this.prisma.group.findMany({
      where: {
        memberships: {
          some: {
            userId,
            status: 'ACTIVE',
          },
        },
      },
      include: {
        church: { select: { name_en: true, name_rw: true, name_fr: true } },
        memberships: {
          where: { userId },
          select: { role: true, joinedAt: true },
        },
      },
    });
  }

  async create(dto: CreateGroupDto, createdBy: string) {
    return this.prisma.group.create({
      data: {
        ...dto,
        createdBy,
      },
      include: {
        church: true,
      },
    });
  }

  async joinGroup(groupId: string, userId: string, dto: JoinGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');

    const existing = await this.prisma.membership.findUnique({
      where: {
        userId_groupId: { userId, groupId },
      },
    });

    if (existing) {
      throw new ForbiddenException('Already a member or pending');
    }

    return this.prisma.membership.create({
      data: {
        userId,
        groupId,
        role: 'GROUP_MEMBER',
        status: 'PENDING',
        interests: dto.interests,
      },
    });
  }

  async updateMembership(
    groupId: string,
    userId: string,
    dto: UpdateMembershipDto,
    updatedBy: string,
  ) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });

    if (!membership) throw new NotFoundException('Membership not found');

    return this.prisma.membership.update({
      where: { userId_groupId: { userId, groupId } },
      data: dto,
    });
  }

  async getMembers(groupId: string) {
    return this.prisma.membership.findMany({
      where: { groupId, status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
  }
}
