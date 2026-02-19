import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, IsDateString } from 'class-validator';
import { PublishStatus } from '@prisma/client';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    churchId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsNotEmpty()
    startDateTime: string;

    @IsDateString()
    @IsNotEmpty()
    endDateTime: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    district?: string;

    @IsString()
    @IsOptional()
    organizerContact?: string;

    @IsUrl()
    @IsOptional()
    bannerImageUrl?: string;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDateTime?: string;

    @IsDateString()
    @IsOptional()
    endDateTime?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    district?: string;

    @IsString()
    @IsOptional()
    organizerContact?: string;

    @IsUrl()
    @IsOptional()
    bannerImageUrl?: string;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}
