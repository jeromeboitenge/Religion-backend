import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateNotificationDto): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                ...data,
                read: false,
            },
        });
    }

    async findAll(userId: string, query?: { limit?: number; offset?: number; unreadOnly?: boolean }): Promise<Notification[]> {
        const where: any = { userId };
        if (query?.unreadOnly) {
            where.read = false;
        }

        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: query?.limit ? Number(query.limit) : 20,
            skip: query?.offset ? Number(query.offset) : 0,
        });
    }

    async markAsRead(id: string, userId: string): Promise<Notification> {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId }
        });

        if (!notification) {
            throw new NotFoundException(`Notification not found`);
        }

        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string): Promise<any> {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
    }

    async delete(id: string, userId: string): Promise<Notification> {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId }
        });

        if (!notification) {
            throw new NotFoundException(`Notification not found`);
        }

        return this.prisma.notification.delete({ where: { id } });
    }
}
