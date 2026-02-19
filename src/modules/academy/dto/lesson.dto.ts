import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsUrl } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    tldr?: string;

    @IsUrl()
    @IsOptional()
    videoUrl?: string;

    @IsInt()
    @Min(0)
    orderIndex: number;
}

export class UpdateLessonDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    tldr?: string;

    @IsUrl()
    @IsOptional()
    videoUrl?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    orderIndex?: number;
}
