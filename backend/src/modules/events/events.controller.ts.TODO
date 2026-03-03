import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get parish calendar events' })
  findAll(@Query('churchId') churchId?: string, @Query('upcoming') upcoming?: string) {
    return this.eventsService.findAll(churchId, upcoming === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('GROUP_LEADER', 'PARISH_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create event' })
  create(@Body() dto: CreateEventDto, @Request() req) {
    return this.eventsService.create(dto, req.user.userId);
  }

  @Get('conflicts/check')
  @ApiOperation({ summary: 'Check for event conflicts' })
  checkConflicts(@Query('churchId') churchId: string, @Query('startTime') startTime: string, @Query('endTime') endTime: string) {
    return this.eventsService.checkConflicts(churchId, startTime, endTime);
  }
}
