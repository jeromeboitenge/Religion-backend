import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
    @ApiProperty({ description: 'Sermon ID to bookmark', required: false })
    @IsOptional()
    @IsUUID()
    sermonId?: string;

    @ApiProperty({ description: 'Devotion ID to bookmark', required: false })
    @IsOptional()
    @IsUUID()
    devotionId?: string;
}
