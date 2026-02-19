import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class CreateReactionDto {
    @IsEnum(ReactionType)
    @IsNotEmpty()
    type: ReactionType;

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
