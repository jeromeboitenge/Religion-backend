import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';
import { PublishStatus, Prisma, Post, Comment, Reaction } from '@prisma/client';

@Injectable()
export class CommunityService {
    constructor(private prisma: PrismaService) { }

    // --- Posts ---

    async createPost(data: CreatePostDto, userId: string): Promise<Post> {
        return this.prisma.post.create({
            data: {
                ...data,
                userId,
                status: PublishStatus.PUBLISHED, // Default to published for MVP
            },
        });
    }

    async findAllPosts(query?: { userId?: string; category?: string }): Promise<Post[]> {
        const where: Prisma.PostWhereInput = {
            status: PublishStatus.PUBLISHED,
        };
        if (query?.userId) where.userId = query.userId;
        // Category filtering if enum match needed

        return this.prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, displayName: true, role: true } }, // basic user info
                _count: { select: { comments: true, reactions: true } }
            }
        });
    }

    async findPost(id: string): Promise<Post> {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, displayName: true } },
            }
        });
        if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
        return post;
    }

    async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
        await this.findPost(id);
        return this.prisma.post.update({ where: { id }, data });
    }

    async deletePost(id: string): Promise<Post> {
        return this.prisma.post.delete({ where: { id } });
    }

    // --- Comments ---

    async createComment(data: CreateCommentDto, userId: string): Promise<Comment> {
        return this.prisma.comment.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async findComments(query: { postId?: string; sermonId?: string; devotionId?: string }): Promise<Comment[]> {
        const where: Prisma.CommentWhereInput = {};
        if (query.postId) where.postId = query.postId;
        if (query.sermonId) where.sermonId = query.sermonId;
        if (query.devotionId) where.devotionId = query.devotionId;

        return this.prisma.comment.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { id: true, displayName: true } }
            }
        });
    }

    async findComment(id: string): Promise<Comment> {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);
        return comment;
    }

    async updateComment(id: string, data: UpdateCommentDto): Promise<Comment> {
        await this.findComment(id);
        return this.prisma.comment.update({ where: { id }, data });
    }

    async deleteComment(id: string): Promise<Comment> {
        return this.prisma.comment.delete({ where: { id } });
    }

    // --- Reactions ---

    async toggleReaction(data: CreateReactionDto, userId: string): Promise<any> {
        const where: Prisma.ReactionWhereInput = {
            userId,
            postId: data.postId || null,
            sermonId: data.sermonId || null,
            devotionId: data.devotionId || null,
        };

        // Since `reaction` has a unique constraint on (userId, postId, sermonId, devotionId)
        // We can try to find existing.

        // Construct unique where clause logic is tricky with optionals in generic find.
        // However, Prisma `findFirst` works.
        const existing = await this.prisma.reaction.findFirst({ where });

        if (existing) {
            // If type matches, remove (toggle off). If different, update type?
            // Let's say toggle off if same type, update if different.
            if (existing.type === data.type) {
                await this.prisma.reaction.delete({ where: { id: existing.id } });
                return { action: 'removed' };
            } else {
                const updated = await this.prisma.reaction.update({
                    where: { id: existing.id },
                    data: { type: data.type }
                });
                return { action: 'updated', reaction: updated };
            }
        } else {
            const created = await this.prisma.reaction.create({
                data: {
                    ...data,
                    userId
                }
            });
            return { action: 'created', reaction: created };
        }
    }
}
