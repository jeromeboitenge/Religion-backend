import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { DevotionsService } from './devotions.service';
import { CreateDevotionDto, UpdateDevotionDto } from './dto/devotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('devotions')
export class DevotionsController {
    constructor(private readonly devotionsService: DevotionsService) { }

    @Get('today')
    async findToday() {
        return this.devotionsService.findToday();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER, Role.MODERATOR)
    @Post()
    async create(@Body() createDevotionDto: CreateDevotionDto, @Request() req: any) {
        return this.devotionsService.create(createDevotionDto, req.user.userId);
    }

    @Get()
    async findAll(@Query('month') month?: string, @Query('year') year?: string) {
        return this.devotionsService.findAll({ month, year });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.devotionsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER, Role.MODERATOR)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDevotionDto: UpdateDevotionDto) {
        return this.devotionsService.update(id, updateDevotionDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.TEACHER, Role.MODERATOR)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.devotionsService.remove(id);
    }
}
