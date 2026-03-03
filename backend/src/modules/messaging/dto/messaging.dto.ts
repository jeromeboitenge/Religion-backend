import { IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ['PRAYER_REQUEST', 'MEETING_DISCUSSION', 'FORMATION_QUESTION', 'SERVICE_PLANNING', 'ENCOURAGEMENT'] })
  @IsEnum(['PRAYER_REQUEST', 'MEETING_DISCUSSION', 'FORMATION_QUESTION', 'SERVICE_PLANNING', 'ENCOURAGEMENT'])
  category: string;

  @ApiProperty()
  @IsUUID()
  groupId: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class SendDirectMessageDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsUUID()
  receiverId: string;
}

export class ReportMessageDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  targetType: string;

  @ApiProperty()
  @IsUUID()
  targetId: string;
}
