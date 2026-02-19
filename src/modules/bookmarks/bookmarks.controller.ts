import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/bookmark.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Bookmarks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Post('toggle')
    @ApiOperation({ summary: 'Toggle bookmark for a sermon or devotion' })
    async toggle(@Body() createBookmarkDto: CreateBookmarkDto, @Request() req: any) {
        return this.bookmarksService.toggleBookmark(createBookmarkDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all bookmarks for the current user' })
    async findAll(@Request() req: any) {
        return this.bookmarksService.findAll(req.user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a specific bookmark by ID' })
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.bookmarksService.remove(id, req.user.userId);
    }
}
