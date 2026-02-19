import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async findAll(query?: { role?: Role; status?: UserStatus }): Promise<User[]> {
        const where: Prisma.UserWhereInput = {};
        if (query?.role) where.role = query.role;
        if (query?.status) where.status = query.status;

        return this.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                displayName: true,
                role: true,
                status: true,
                createdAt: true,
                churchId: true,
            } as any, // Avoiding password exposure
        });
    }

    async updateRole(id: string, role: Role): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
}
