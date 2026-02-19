import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChurchesService } from '../churches/churches.service';
import { Role } from '@prisma/client';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly churchesService: ChurchesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, createEventDto.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to post events for this church');
        }
        return this.eventsService.create(createEventDto);
    }

    @Get()
    async findAll(@Query('churchId') churchId?: string, @Query('district') district?: string) {
        return this.eventsService.findAll({ churchId, district });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
        const event = await this.eventsService.findOne(id);
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, event.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this event');
        }
        return this.eventsService.update(id, updateEventDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        const event = await this.eventsService.findOne(id);
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, event.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this event');
        }
        return this.eventsService.remove(id);
    }
}
