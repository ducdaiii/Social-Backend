import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './schema/chatting.schema';

@Injectable()
export class ChattingService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async sendMessage(createMessageDto: CreateMessageDto) {
    const { sender, receiver, content } = createMessageDto;
  
    const message = new this.messageModel({
      sender: new Types.ObjectId(sender),
      receiver: new Types.ObjectId(receiver),
      content,
    });

    return await message.save();
  }

  async getMessagesBetweenUsers(senderId: string, receiverId: string): Promise<Message[]> {
    return this.messageModel
      .find({ 
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  async markAsRead(id: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true }).exec();
  }

  async updateMessage(id: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true }).exec();
  }
}