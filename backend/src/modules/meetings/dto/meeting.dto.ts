import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty()
  @IsUUID()
  groupId: string;
}

export class CheckInDto {
  @ApiProperty()
  @IsUUID()
  meetingId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrCode?: string;
}

export class MeetingMinutesDto {
  @ApiProperty()
  @IsString()
  content_en: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content_rw?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content_fr?: string;
}
