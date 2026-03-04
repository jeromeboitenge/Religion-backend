import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DevotionsService } from './devotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('devotions')
@Controller('devotions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DevotionsController {
  constructor(private readonly devotionsService: DevotionsService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get today devotion' })
  getToday() {
    return this.devotionsService.getToday();
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get devotion by date (YYYY-MM-DD)' })
  getByDate(@Param('date') date: string) {
    return this.devotionsService.getByDate(date);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get last 7 days devotions' })
  getRecent() {
    return this.devotionsService.getRecent();
  }
}
