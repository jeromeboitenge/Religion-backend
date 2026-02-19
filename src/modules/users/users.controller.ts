import { Controller, Get, UseGuards, Param, Patch, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Get()
    @ApiOperation({ summary: 'Get all users (Super Admin only)' })
    async findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.MODERATOR)
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/role')
    @ApiOperation({ summary: 'Update user role (Super Admin only)' })
    async updateRole(@Param('id') id: string, @Body('role') role: Role) {
        return this.usersService.updateRole(id, role);
    }
}
