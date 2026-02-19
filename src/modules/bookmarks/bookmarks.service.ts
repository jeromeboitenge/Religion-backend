import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/bookmark.dto';
import { Bookmark, Prisma } from '@prisma/client';

@Injectable()
export class BookmarksService {
    constructor(private prisma: PrismaService) { }

    async toggleBookmark(data: CreateBookmarkDto, userId: string): Promise<any> {
        if (!data.sermonId && !data.devotionId) {
            throw new ConflictException('Either sermonId or devotionId must be provided');
        }

        const where: Prisma.BookmarkWhereInput = {
            userId,
            sermonId: data.sermonId || null,
            devotionId: data.devotionId || null,
        };

        const existing = await this.prisma.bookmark.findFirst({ where });

        if (existing) {
            await this.prisma.bookmark.delete({ where: { id: existing.id } });
            return { action: 'removed' };
        } else {
            const created = await this.prisma.bookmark.create({
                data: {
                    userId,
                    sermonId: data.sermonId,
                    devotionId: data.devotionId,
                }
            });
            return { action: 'created', bookmark: created };
        }
    }

    async findAll(userId: string): Promise<Bookmark[]> {
        return this.prisma.bookmark.findMany({
            where: { userId },
            include: {
                sermon: { select: { id: true, title: true, thumbnailUrl: true } },
                devotion: { select: { id: true, title: true, bibleReference: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(id: string, userId: string): Promise<Bookmark> {
        return this.prisma.bookmark.delete({
            where: { id, userId },
        });
    }
}
