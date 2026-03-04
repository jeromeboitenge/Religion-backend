import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('announcements')
@Controller('announcements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get announcements' })
  findAll(@Query('churchId') churchId?: string, @Query('groupId') groupId?: string) {
    return this.announcementsService.findAll(churchId, groupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('GROUP_LEADER', 'PARISH_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create announcement' })
  create(@Body() dto: CreateAnnouncementDto, @Request() req: any) {
    return this.announcementsService.create(dto, req.user.userId);
  }
}
