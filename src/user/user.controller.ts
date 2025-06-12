import { 
  Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request 
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { EditGuard } from 'src/guard/edit.guard';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(EditGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: any): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(EditGuard)
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }

  // API Follow user
  @Post('follow/:id')
  async followUser(@Request() req, @Param('id') targetUserId: string) {
    if (!req.user || !targetUserId) {
      throw new Error('Unauthorized'); 
    }
    const followerId = new Types.ObjectId(req.user);
    const followingId = new Types.ObjectId(targetUserId);
    return this.userService.followUser(followerId, followingId);
  }

  // API Unfollow user
  @Post('unfollow/:id')
  async unfollowUser(@Request() req, @Param('id') targetUserId: string) {
    if (!req.user || !targetUserId) {
      throw new Error('Unauthorized');
    }
    return this.userService.unfollowUser(req.user, targetUserId);
  }

  @Get(':id/following')
  async getFollowedUsers(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getAllFollowedUsers(userId);
  }
}