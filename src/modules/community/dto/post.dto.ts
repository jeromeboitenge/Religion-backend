import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { PostCategory, Language, PublishStatus, ReactionType } from '@prisma/client';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsEnum(PostCategory)
    @IsNotEmpty()
    category: PostCategory;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsEnum(Language)
    @IsOptional()
    language?: Language;
}

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    body?: string;

    @IsEnum(PostCategory)
    @IsOptional()
    category?: PostCategory;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;
}
