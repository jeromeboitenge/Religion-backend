import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus, Prisma, Church } from '@prisma/client';
import { CreateChurchDto, UpdateChurchDto } from './dto/church.dto';

@Injectable()
export class ChurchesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateChurchDto, userId: string): Promise<Church> {
        return this.prisma.church.create({
            data: {
                ...data,
                admins: {
                    connect: { id: userId },
                },
            },
        });
    }

    async findAll(query?: { district?: string; verified?: boolean; organizationId?: string }): Promise<Church[]> {
        const where: Prisma.ChurchWhereInput = {};
        if (query?.district) {
            where.district = { contains: query.district, mode: 'insensitive' };
        }
        if (query?.verified !== undefined) {
            where.verificationStatus = query.verified ? VerificationStatus.VERIFIED : undefined;
        }
        if (query?.organizationId) {
            where.organizationId = query.organizationId;
        }

        return this.prisma.church.findMany({
            where,
            include: {
                _count: {
                    select: { sermons: true, events: true, followers: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Church> {
        const church = await this.prisma.church.findUnique({
            where: { id },
            include: {
                admins: {
                    select: { id: true, displayName: true, email: true },
                },
            },
        });
        if (!church) {
            throw new NotFoundException(`Church with ID ${id} not found`);
        }
        return church;
    }

    async update(id: string, data: UpdateChurchDto): Promise<Church> {
        await this.findOne(id);
        return this.prisma.church.update({
            where: { id },
            data,
        });
    }

    async verify(id: string, status: VerificationStatus): Promise<Church> {
        await this.findOne(id);
        return this.prisma.church.update({
            where: { id },
            data: { verificationStatus: status },
        });
    }

    async isChurchAdmin(userId: string, churchId: string): Promise<boolean> {
        const church = await this.prisma.church.findFirst({
            where: {
                id: churchId,
                admins: {
                    some: { id: userId }
                }
            }
        });
        return !!church;
    }
}
