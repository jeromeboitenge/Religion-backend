import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, IsArray } from 'class-validator';
import { MediaType, PublishStatus, Language } from '@prisma/client';

export class CreateSermonDto {
    @IsString()
    @IsNotEmpty()
    churchId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    preacherName?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(MediaType)
    mediaType: MediaType;

    @IsUrl()
    mediaUrl: string;

    @IsUrl()
    @IsOptional()
    thumbnailUrl?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}

export class UpdateSermonDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    preacherName?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(MediaType)
    @IsOptional()
    mediaType?: MediaType;

    @IsUrl()
    @IsOptional()
    mediaUrl?: string;

    @IsUrl()
    @IsOptional()
    thumbnailUrl?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}
