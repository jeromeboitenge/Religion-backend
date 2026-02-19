import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsObject()
    @IsOptional()
    data?: any;
}

export class UpdateNotificationDto {
    @IsBoolean()
    @IsOptional()
    read?: boolean;
}
