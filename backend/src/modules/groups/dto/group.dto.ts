import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GroupType } from '@prisma/client';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: GroupType })
  @IsEnum(GroupType)
  type: GroupType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meetingDay?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meetingTime?: string;

  @ApiProperty()
  @IsUUID()
  churchId: string;
}

export class JoinGroupDto {
  @ApiProperty()
  @IsUUID()
  groupId: string;
}

export class UpdateMembershipDto {
  @ApiProperty({ enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'AUXILIARY'] })
  @IsEnum(['PENDING', 'ACTIVE', 'INACTIVE', 'AUXILIARY'])
  status: string;

  @ApiProperty({ enum: ['MEMBER', 'LEADER', 'SECRETARY', 'TREASURER', 'SPIRITUAL_DIRECTOR'], required: false })
  @IsOptional()
  @IsEnum(['MEMBER', 'LEADER', 'SECRETARY', 'TREASURER', 'SPIRITUAL_DIRECTOR'])
  role?: string;
}
