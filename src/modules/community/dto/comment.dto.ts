import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    body: string;

    @IsString()
    @IsOptional()
    postId?: string;

    @IsString()
    @IsOptional()
    sermonId?: string;

    @IsString()
    @IsOptional()
    devotionId?: string;
}

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    body: string;
}
