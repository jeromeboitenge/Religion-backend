import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty()
  @IsString()
  groupId: string;

  @ApiProperty()
  @IsString()
  title_en: string;

  @ApiProperty()
  @IsString()
  title_rw: string;

  @ApiProperty()
  @IsString()
  title_fr: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description_en?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description_rw?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description_fr?: string;

  @ApiProperty()
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class CheckInDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrCode?: string;
}

export class MeetingMinutesDto {
  @ApiProperty()
  @IsString()
  minutes_en: string;

  @ApiProperty()
  @IsString()
  minutes_rw: string;

  @ApiProperty()
  @IsString()
  minutes_fr: string;
}
