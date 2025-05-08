import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  BadRequestException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { Types } from 'mongoose';

@Controller('chat')
export class ChattingController {
  constructor(private readonly chatService: ChattingService) {}

  @Get('user/:userId')
  async getUserChats(@Param('userId') userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.chatService.getChatsByUserId(userId);
  }

  @Post('send')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('chatId') chatId: string,
    @Body('content') content: string,
    @Body('type') type: string,
    @Body('fileUrl') fileUrl?: string,
    @Body('replyTo') replyTo?: string,
  ) {
    if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid senderId or chatId');
    }
    return this.chatService.sendMessage(
      new Types.ObjectId(senderId),
      new Types.ObjectId(chatId),
      content,
      type,
      fileUrl,
      replyTo ? new Types.ObjectId(replyTo) : undefined,
    );
  }

  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new NotFoundException('Invalid chat ID');
    }
    return this.chatService.getMessages(new Types.ObjectId(chatId));
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Body('userId') userId: string) {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid messageId or userId');
    }
    return this.chatService.markAsRead(id, userId);
  }

  @Patch(':id/pin/:chatId')
  async pinMessage(@Param('id') id: string, @Param('chatId') chatId: string) {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid messageId or chatId');
    }
    return this.chatService.pinMessage(id, chatId);
  }

  @Delete('message/:id')
  async softDeleteMessage(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid message ID');
    }
    return this.chatService.softDeleteMessage(id);
  }

  @Post('private/create')
  async createPrivateChat(
    @Body('user1') user1: string,
    @Body('user2') user2: string,
  ) {
    return this.chatService.createPrivateChat(
      new Types.ObjectId(user1),
      new Types.ObjectId(user2),
    );
  }

  @Post('group/create')
  async createGroupChat(
    @Body('groupName') groupName: string,
    @Body('members') members: string[],
    @Body('creatorId') creatorId: string,
  ) {
    const memberIds = members.map((id) => new Types.ObjectId(id));
    return this.chatService.createGroupChat(
      groupName,
      memberIds,
      new Types.ObjectId(creatorId),
    );
  }

  @Patch('group/:groupId/add')
  async addMember(
    @Param('groupId') groupId: string,
    @Body('userId') userId: string,
  ) {
    return this.chatService.addMember(groupId, userId);
  }

  @Patch('group/:groupId/remove')
  async removeMember(
    @Param('groupId') groupId: string,
    @Body('userId') userId: string,
  ) {
    return this.chatService.removeMember(groupId, userId);
  }

  @Delete('group/:chatId')
  async deleteChat(@Param('chatId') chatId: string, @Request() req) {
    if (!req.user || !Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid chatId or userId');
    }
    await this.chatService.deleteChat(chatId, req.user.id);
    return { message: 'Chat deleted successfully' };
  }

  @Post('group/:chatId/leave')
  async leaveGroup(@Param('chatId') chatId: string, @Request() req) {
    if (!req.user || !Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid chatId or userId');
    }
    await this.chatService.leaveGroup(chatId, req.user.id);
    return { message: 'You have left the group' };
  }
}