import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBooleany, IsArray, IsBoolean } from 'class-validator';
import { PublishStatus, Language } from '@prisma/client';

export class CreateDevotionDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    bibleReference: string;

    @IsString()
    @IsNotEmpty()
    verseText: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    prayer?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    reflectionQuestions?: string[];

    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @IsBoolean()
    @IsOptional()
    featured?: boolean;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}

export class UpdateDevotionDto {
    @IsDateString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    bibleReference?: string;

    @IsString()
    @IsOptional()
    verseText?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    prayer?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    reflectionQuestions?: string[];

    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @IsBoolean()
    @IsOptional()
    featured?: boolean;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}
