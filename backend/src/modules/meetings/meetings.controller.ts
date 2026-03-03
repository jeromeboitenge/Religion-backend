import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, CheckInDto, MeetingMinutesDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('meetings')
@Controller('meetings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get meetings by group' })
  findAll(@Query('groupId') groupId: string, @Query('upcoming') upcoming?: string) {
    return this.meetingsService.findAll(groupId, upcoming === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting by ID' })
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('GROUP_LEADER', 'SECRETARY', 'PARISH_ADMIN')
  @ApiOperation({ summary: 'Create meeting' })
  create(@Body() dto: CreateMeetingDto, @Request() req) {
    return this.meetingsService.create(dto, req.user.userId);
  }

  @Post(':id/checkin')
  @ApiOperation({ summary: 'Check in to meeting' })
  checkIn(@Param('id') id: string, @Body() dto: CheckInDto, @Request() req) {
    return this.meetingsService.checkIn(id, req.user.userId, dto);
  }

  @Get(':id/attendance')
  @ApiOperation({ summary: 'Get meeting attendance' })
  getAttendance(@Param('id') id: string) {
    return this.meetingsService.getAttendance(id);
  }

  @Post(':id/minutes')
  @UseGuards(RolesGuard)
  @Roles('SECRETARY', 'GROUP_LEADER')
  @ApiOperation({ summary: 'Add meeting minutes' })
  addMinutes(@Param('id') id: string, @Body() dto: MeetingMinutesDto) {
    return this.meetingsService.addMinutes(id, dto);
  }

  @Get('user/history')
  @ApiOperation({ summary: 'Get user attendance history' })
  getUserHistory(@Request() req, @Query('groupId') groupId?: string) {
    return this.meetingsService.getUserHistory(req.user.userId, groupId);
  }
}
