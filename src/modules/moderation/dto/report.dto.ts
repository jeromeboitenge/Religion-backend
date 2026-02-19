import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ReportReason, ReportStatus } from '@prisma/client';

export class CreateReportDto {
    @IsEnum(ReportReason)
    @IsNotEmpty()
    reason: ReportReason;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    targetId: string;

    @IsString()
    @IsNotEmpty()
    targetType: string; // "POST", "COMMENT", "SERMON", "USER", etc.
}

export class UpdateReportDto {
    @IsEnum(ReportStatus)
    @IsNotEmpty()
    status: ReportStatus;
}
