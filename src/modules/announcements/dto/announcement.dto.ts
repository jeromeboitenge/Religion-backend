import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PublishStatus } from '@prisma/client';

export class CreateAnnouncementDto {
    @IsString()
    @IsNotEmpty()
    churchId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsDateString()
    @IsNotEmpty()
    startVisible: string;

    @IsDateString()
    @IsNotEmpty()
    endVisible: string;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}

export class UpdateAnnouncementDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    body?: string;

    @IsDateString()
    @IsOptional()
    startVisible?: string;

    @IsDateString()
    @IsOptional()
    endVisible?: string;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}
