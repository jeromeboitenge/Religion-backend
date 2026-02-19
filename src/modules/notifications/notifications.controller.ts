import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.MODERATOR) // Only admins trigger system notifications manually
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Request() req: any, @Query('limit') limit?: number, @Query('unread') unread?: boolean) {
        return this.notificationService.findAll(req.user.userId, { limit, unreadOnly: unread });
    }

    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    markAsRead(@Param('id') id: string, @Request() req: any) {
        return this.notificationService.markAsRead(id, req.user.userId);
    }

    @Patch('read-all')
    @UseGuards(JwtAuthGuard)
    markAllAsRead(@Request() req: any) {
        return this.notificationService.markAllAsRead(req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Request() req: any) {
        return this.notificationService.delete(id, req.user.userId);
    }
}
