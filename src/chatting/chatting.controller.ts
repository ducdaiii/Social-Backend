import { Controller, Get, Post, Body, Patch, Param, Put, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChattingService } from './chatting.service';
import { EditGuard } from 'src/guard/edit.guard';

@Controller('chat')
export class ChattingController {
  constructor(private readonly chatService: ChattingService) {}

  // Gửi tin nhắn
  @Post('send')
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.sendMessage(createMessageDto);
  }

  // Lấy tin nhắn giữa hai người dùng
  @Get(':senderId/t/:receiverId')
  async getMessagesBetweenUsers(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatService.getMessagesBetweenUsers(senderId, receiverId);
  }

  // Đánh dấu tin nhắn là đã đọc (chỉ chỉnh sửa trạng thái)
  @Patch(':id')
  @UseGuards(EditGuard)
  async markAsRead(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.chatService.markAsRead(id, updateMessageDto);
  }

  // Cập nhật nội dung tin nhắn
  @Put(':id')
  @UseGuards(EditGuard)
  async updateMessage(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.chatService.updateMessage(id, updateMessageDto);
  }
}