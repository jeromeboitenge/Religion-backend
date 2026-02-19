import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { SermonsService } from './sermons.service';
import { CreateSermonDto, UpdateSermonDto } from './dto/sermon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChurchesService } from '../churches/churches.service';
import { Role } from '@prisma/client';

@Controller('sermons')
export class SermonsController {
    constructor(
        private readonly sermonsService: SermonsService,
        private readonly churchesService: ChurchesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createSermonDto: CreateSermonDto, @Request() req: any) {
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, createSermonDto.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to post sermons for this church');
        }
        return this.sermonsService.create(createSermonDto);
    }

    @Get()
    async findAll(
        @Query('churchId') churchId?: string,
        @Query('language') language?: string,
    ) {
        return this.sermonsService.findAll({ churchId, language });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.sermonsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSermonDto: UpdateSermonDto, @Request() req: any) {
        const sermon = await this.sermonsService.findOne(id);
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, sermon.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this sermon');
        }
        return this.sermonsService.update(id, updateSermonDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        const sermon = await this.sermonsService.findOne(id);
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, sermon.churchId);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this sermon');
        }
        return this.sermonsService.remove(id);
    }

    @Patch(':id/views')
    async incrementViewCount(@Param('id') id: string) {
        return this.sermonsService.incrementViewCount(id);
    }
}
