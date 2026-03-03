import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsString()
  churchId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiProperty()
  @IsString()
  title_en: string;

  @ApiProperty()
  @IsString()
  title_rw: string;

  @ApiProperty()
  @IsString()
  title_fr: string;

  @ApiProperty()
  @IsString()
  content_en: string;

  @ApiProperty()
  @IsString()
  content_rw: string;

  @ApiProperty()
  @IsString()
  content_fr: string;

  @ApiProperty({ enum: ['INFO', 'URGENT', 'EVENT', 'REMINDER'] })
  @IsEnum(['INFO', 'URGENT', 'EVENT', 'REMINDER'])
  priority: string;
}
