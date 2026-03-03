import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { CreateThreadDto, SendMessageDto, SendDirectMessageDto, ReportMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('messaging')
@Controller('messaging')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('threads')
  @ApiOperation({ summary: 'Get group threads' })
  getThreads(@Query('groupId') groupId: string) {
    return this.messagingService.getThreads(groupId);
  }

  @Get('threads/:id')
  @ApiOperation({ summary: 'Get thread messages' })
  getThread(@Param('id') id: string) {
    return this.messagingService.getThread(id);
  }

  @Post('threads')
  @ApiOperation({ summary: 'Create new thread' })
  createThread(@Body() dto: CreateThreadDto, @Request() req) {
    return this.messagingService.createThread(dto, req.user.userId);
  }

  @Post('threads/:id/messages')
  @ApiOperation({ summary: 'Send message to thread' })
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @Request() req) {
    return this.messagingService.sendMessage(id, req.user.userId, dto);
  }

  @Get('direct')
  @ApiOperation({ summary: 'Get direct message conversations' })
  getDirectMessages(@Request() req) {
    return this.messagingService.getDirectMessages(req.user.userId);
  }

  @Post('direct')
  @ApiOperation({ summary: 'Send direct message' })
  sendDirectMessage(@Body() dto: SendDirectMessageDto, @Request() req) {
    return this.messagingService.sendDirectMessage(req.user.userId, dto);
  }

  @Post('messages/:id/report')
  @ApiOperation({ summary: 'Report message' })
  reportMessage(@Param('id') id: string, @Body() dto: ReportMessageDto, @Request() req) {
    return this.messagingService.reportMessage(id, req.user.userId, dto);
  }
}
