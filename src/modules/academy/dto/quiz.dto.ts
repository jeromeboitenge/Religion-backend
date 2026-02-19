import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CreateQuizDto {
    @IsString()
    @IsNotEmpty()
    lessonId: string;

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    options: string[];

    @IsInt()
    @Min(0)
    correctAnswerIndex: number;

    @IsString()
    @IsOptional()
    explanation?: string;
}

export class UpdateQuizDto {
    @IsString()
    @IsOptional()
    question?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    options?: string[];

    @IsInt()
    @Min(0)
    @IsOptional()
    correctAnswerIndex?: number;

    @IsString()
    @IsOptional()
    explanation?: string;
}
