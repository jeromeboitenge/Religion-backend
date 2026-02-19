import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    // --- Posts ---

    @UseGuards(JwtAuthGuard)
    @Post('posts')
    async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
        return this.communityService.createPost(createPostDto, req.user.userId);
    }

    @Get('posts')
    async findAllPosts(@Query('userId') userId?: string, @Query('category') category?: string) {
        return this.communityService.findAllPosts({ userId, category });
    }

    @Get('posts/:id')
    async findPost(@Param('id') id: string) {
        return this.communityService.findPost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('posts/:id')
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req: any) {
        const post = await this.communityService.findPost(id);
        if (post.userId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN && req.user.role !== Role.MODERATOR) {
            throw new ForbiddenException('You do not have permission to update this post');
        }
        return this.communityService.updatePost(id, updatePostDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('posts/:id')
    async deletePost(@Param('id') id: string, @Request() req: any) {
        const post = await this.communityService.findPost(id);
        if (post.userId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN && req.user.role !== Role.MODERATOR) {
            throw new ForbiddenException('You do not have permission to delete this post');
        }
        return this.communityService.deletePost(id);
    }

    // --- Comments ---

    @UseGuards(JwtAuthGuard)
    @Post('comments')
    async createComment(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
        return this.communityService.createComment(createCommentDto, req.user.userId);
    }

    @Get('comments')
    async findComments(
        @Query('postId') postId?: string,
        @Query('sermonId') sermonId?: string,
        @Query('devotionId') devotionId?: string
    ) {
        return this.communityService.findComments({ postId, sermonId, devotionId });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('comments/:id')
    async deleteComment(@Param('id') id: string, @Request() req: any) {
        const comment = await this.communityService.findComment(id);
        if (comment.userId !== req.user.userId && req.user.role !== Role.SUPER_ADMIN && req.user.role !== Role.MODERATOR) {
            throw new ForbiddenException('You do not have permission to delete this comment');
        }
        return this.communityService.deleteComment(id);
    }

    // --- Reactions ---

    @UseGuards(JwtAuthGuard)
    @Post('reactions')
    async toggleReaction(@Body() createReactionDto: CreateReactionDto, @Request() req: any) {
        return this.communityService.toggleReaction(createReactionDto, req.user.userId);
    }
}
