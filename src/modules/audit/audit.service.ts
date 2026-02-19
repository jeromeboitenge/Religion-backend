import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(action: string, performedBy: string, targetType: string, targetId: string, details?: any) {
        return this.prisma.auditLog.create({
            data: {
                action,
                performedBy,
                targetType,
                targetId,
                details,
            },
        });
    }
}
