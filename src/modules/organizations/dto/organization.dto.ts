import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { OrganizationStatus } from '@prisma/client';

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    logoUrl?: string;

    @IsEnum(OrganizationStatus)
    @IsOptional()
    status?: OrganizationStatus;
}

export class UpdateOrganizationDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    logoUrl?: string;

    @IsEnum(OrganizationStatus)
    @IsOptional()
    status?: OrganizationStatus;
}
