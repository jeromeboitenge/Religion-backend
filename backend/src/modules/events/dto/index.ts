import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
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
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}
