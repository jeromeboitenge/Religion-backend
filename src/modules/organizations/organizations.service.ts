import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { Organization, OrganizationStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrganizationService {
    constructor(
        private prisma: PrismaService,
        private audit: AuditService
    ) { }

    async create(data: CreateOrganizationDto): Promise<Organization> {
        return this.prisma.organization.create({
            data: {
                ...data,
                status: data.status || OrganizationStatus.ACTIVE,
            },
        });
    }

    async findAll(): Promise<Organization[]> {
        return this.prisma.organization.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { churches: true },
                },
            },
        });
    }

    async findOne(id: string): Promise<Organization> {
        const org = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                churches: {
                    select: { id: true, name: true, district: true, logoUrl: true },
                },
            },
        });
        if (!org) {
            throw new NotFoundException(`Organization with ID ${id} not found`);
        }
        return org;
    }

    async update(id: string, data: UpdateOrganizationDto, adminId?: string): Promise<Organization> {
        const org = await this.findOne(id);
        const updated = await this.prisma.organization.update({
            where: { id },
            data,
        });

        if (adminId) {
            await this.audit.log(
                'UPDATE_ORGANIZATION',
                adminId,
                'ORGANIZATION',
                id,
                { old: org, new: data }
            );
        }

        return updated;
    }

    async remove(id: string): Promise<Organization> {
        return this.prisma.organization.delete({
            where: { id },
        });
    }
}
