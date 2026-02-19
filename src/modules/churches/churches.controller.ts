import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { CreateChurchDto, UpdateChurchDto } from './dto/church.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, VerificationStatus } from '@prisma/client';

@Controller('churches')
export class ChurchesController {
    constructor(private readonly churchesService: ChurchesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createChurchDto: CreateChurchDto, @Request() req: any) {
        return this.churchesService.create(createChurchDto, req.user.userId);
    }

    @Get()
    async findAll(@Query('district') district?: string, @Query('organizationId') organizationId?: string) {
        return this.churchesService.findAll({ district, verified: true, organizationId });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.MODERATOR)
    @Get('admin/all')
    async findAllAdmin() {
        return this.churchesService.findAll({});
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.churchesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateChurchDto: UpdateChurchDto, @Request() req: any) {
        const isOwner = await this.churchesService.isChurchAdmin(req.user.userId, id);
        if (!isOwner && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('You do not have permission to update this church');
        }
        return this.churchesService.update(id, updateChurchDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Post(':id/verify')
    async verify(@Param('id') id: string, @Body('status') status: VerificationStatus, @Request() req: any) {
        return this.churchesService.verify(id, status, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/follow')
    async toggleFollow(@Param('id') id: string, @Request() req: any) {
        return this.churchesService.toggleFollow(req.user.userId, id);
    }
}
