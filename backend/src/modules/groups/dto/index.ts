import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsString()
  name_rw: string;

  @ApiProperty()
  @IsString()
  name_fr: string;

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

  @ApiProperty({ enum: ['LEGION_PRAESIDIUM', 'CHARISMATIC', 'CATHOLIC_ACTION', 'YOUTH_GROUP', 'CHOIR', 'SCC', 'OTHER'] })
  @IsEnum(['LEGION_PRAESIDIUM', 'CHARISMATIC', 'CATHOLIC_ACTION', 'YOUTH_GROUP', 'CHOIR', 'SCC', 'OTHER'])
  type: string;

  @ApiProperty()
  @IsString()
  churchId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  councilHierarchyId?: string;
}

export class JoinGroupDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}

export class UpdateMembershipDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['YOUTH_USER', 'GROUP_MEMBER', 'GROUP_LEADER', 'SECRETARY', 'TREASURER'])
  role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: string;
}
