import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto, JoinGroupDto, UpdateMembershipDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all groups with filters' })
  findAll(
    @Query('churchId') churchId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.groupsService.findAll({ churchId, type, search });
  }

  @Get('my-groups')
  @ApiOperation({ summary: 'Get current user groups' })
  getMyGroups(@Request() req) {
    return this.groupsService.getUserGroups(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('PARISH_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create new group' })
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Request to join group' })
  joinGroup(@Param('id') id: string, @Body() joinGroupDto: JoinGroupDto, @Request() req) {
    return this.groupsService.joinGroup(id, req.user.userId, joinGroupDto);
  }

  @Patch(':groupId/members/:userId')
  @UseGuards(RolesGuard)
  @Roles('GROUP_LEADER', 'PARISH_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update membership status' })
  updateMembership(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateMembershipDto,
    @Request() req,
  ) {
    return this.groupsService.updateMembership(groupId, userId, updateDto, req.user.userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get group members' })
  getMembers(@Param('id') id: string) {
    return this.groupsService.getMembers(id);
  }
}
