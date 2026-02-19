import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, IsInt, Min } from 'class-validator';
import { CourseLevel, PublishStatus, ApprovalStatus, Language } from '@prisma/client';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsEnum(CourseLevel)
    @IsOptional()
    level?: CourseLevel;

    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @IsUrl()
    @IsOptional()
    coverImageUrl?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    estimatedDuration?: number;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsEnum(CourseLevel)
    @IsOptional()
    level?: CourseLevel;

    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @IsUrl()
    @IsOptional()
    coverImageUrl?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    estimatedDuration?: number;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;

    // Approval status only updated by admin
}
