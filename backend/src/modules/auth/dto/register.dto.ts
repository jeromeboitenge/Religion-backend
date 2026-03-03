import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    displayName?: string;

    @IsString()
    @IsOptional()
    district?: string;
}
