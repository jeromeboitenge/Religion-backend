import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  title_en: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title_rw?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title_fr?: string;

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

  @ApiProperty({ enum: ['BEGINNER', 'GROWING', 'SERVING', 'LEADERSHIP'] })
  @IsEnum(['BEGINNER', 'GROWING', 'SERVING', 'LEADERSHIP'])
  level: string;

  @ApiProperty()
  @IsInt()
  orderIndex: number;

  @ApiProperty()
  @IsInt()
  durationMin: number;
}

export class QuizAttemptDto {
  @ApiProperty()
  @IsInt()
  selectedIndex: number;
}
