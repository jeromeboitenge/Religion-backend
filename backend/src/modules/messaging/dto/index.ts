import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty()
  @IsString()
  groupId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ['PRAYER_REQUEST', 'MEETING_DISCUSSION', 'FORMATION_QUESTION', 'SERVICE_PLANNING', 'ENCOURAGEMENT'] })
  @IsEnum(['PRAYER_REQUEST', 'MEETING_DISCUSSION', 'FORMATION_QUESTION', 'SERVICE_PLANNING', 'ENCOURAGEMENT'])
  category: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class SendDirectMessageDto {
  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class ReportMessageDto {
  @ApiProperty({ enum: ['SPAM', 'INAPPROPRIATE', 'HARASSMENT', 'OTHER'] })
  @IsEnum(['SPAM', 'INAPPROPRIATE', 'HARASSMENT', 'OTHER'])
  reason: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
