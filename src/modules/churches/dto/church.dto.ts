import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray } from 'class-validator';

export class CreateChurchDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsOptional()
    sector?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    contactPhone?: string;

    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    serviceTimes?: any;

    @IsString()
    @IsOptional()
    website?: string;
}

export class UpdateChurchDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    district?: string;

    @IsString()
    @IsOptional()
    sector?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    contactPhone?: string;

    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    serviceTimes?: any;

    @IsString()
    @IsOptional()
    website?: string;

    // Verification status only updated by admin via specific endpoint
}
