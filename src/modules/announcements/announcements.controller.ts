import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChurchesService } from '../churches/churches.service';
import { Role } from '@prisma/client';

@Controller('announcements')
export class AnnouncementsController {
    constructor(
        private readonly announcementsService: AnnouncementsService,
        private readonly churchesService: ChurchesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Request() req: any) {
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, createAnnouncementDto.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to post announcements for this church');
        }
        return this.announcementsService.create(createAnnouncementDto);
    }

    @Get()
    async findAll(@Query('churchId') churchId?: string) {
        return this.announcementsService.findAll({ churchId });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.announcementsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto, @Request() req: any) {
        const announcement = await this.announcementsService.findOne(id);
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, announcement.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this announcement');
        }
        return this.announcementsService.update(id, updateAnnouncementDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        const announcement = await this.announcementsService.findOne(id);
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, announcement.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this announcement');
        }
        return this.announcementsService.remove(id);
    }
}
