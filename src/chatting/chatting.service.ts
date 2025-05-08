import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { Message, MessageDocument } from './schema/message.schema';
import { Chat, ChatDocument } from './schema/chat.schema';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class ChattingService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private readonly redisService: RedisService
  ) {}

  async getChatsByUserId(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
  
    return this.chatModel
      .find({ members: { $in: [new Types.ObjectId(userId)] } }) 
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .exec();
  }

  async sendMessage(
    senderId: Types.ObjectId,
    chatId: Types.ObjectId,
    content: string,
    type: string, 
    fileUrl?: string, 
    replyTo?: Types.ObjectId
  ) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
  
    if (!['text', 'image', 'video', 'file', 'link', 'audio', 'sticker', 'emoji'].includes(type)) {
      throw new BadRequestException('Invalid message type');
    }

    const message = await this.messageModel.create({
      sender: senderId,
      chatId,
      content,
      type,
      fileUrl: fileUrl || null,
      replyTo: replyTo || null,
      isRead: false,
      seenBy: [],
      isDeleted: false,
      deletedAt: null,
    });
  
    console.log(message);
    chat.lastMessage = message.id;
    await chat.save();
  
    this.server.to(chatId.toString()).emit('newMessage', message);
  
    return message;
  }  

  async getChat(chatId: string, page: number, limit: number): Promise<Message[]> {
    const messages = await this.messageModel.find({ chatId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return messages;
  }
  
  async getMessages(chatId: Types.ObjectId) {
    const messages = await this.messageModel.find({ chatId }).sort({ createdAt: 1 }).exec();
    if (!messages) {
      throw new NotFoundException('No messages found for this chat');
    }
    return messages;
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(messageId, { $addToSet: { seenBy: userId } }, { new: true });
    this.server.to(updatedMessage.chatId.toString()).emit('messageRead', updatedMessage);
    return updatedMessage;
  }

  async pinMessage(messageId: string, chatId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    await this.chatModel.findByIdAndUpdate(chatId, { pinnedMessage: messageId });
    this.server.to(chatId).emit('messagePinned', message);
    return message;
  }

  async softDeleteMessage(messageId: string): Promise<Message> {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
    this.server.to(updatedMessage.chatId.toString()).emit('messageDeleted', updatedMessage);
    return updatedMessage;
  }

  async createPrivateChat(user1: Types.ObjectId, user2: Types.ObjectId) {
    let chat = await this.chatModel.findOne({ type: 'private', members: { $all: [user1, user2] } });
    if (!chat) {
      chat = await this.chatModel.create({ type: 'private', members: [user1, user2] });
    }
    return chat;
  }

  async createGroupChat(groupName: string, memberIds: Types.ObjectId[], creatorId: Types.ObjectId) {
    if (!memberIds.includes(creatorId)) memberIds.push(creatorId);
    if (memberIds.length < 3) throw new BadRequestException('A group must have at least 3 members');

    return this.chatModel.create({ type: 'group', groupName, members: memberIds });
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ members: userId }).populate('lastMessage').exec();
  }

  async addMember(groupId: string, userId: string): Promise<Chat> {
    return this.chatModel.findByIdAndUpdate(groupId, { $addToSet: { members: new Types.ObjectId(userId) } }, { new: true }).exec();
  }

  async removeMember(groupId: string, userId: string): Promise<Chat> {
    return this.chatModel.findByIdAndUpdate(groupId, { $pull: { members: new Types.ObjectId(userId) } }, { new: true }).exec();
  }

  async deleteChat(chatId: string, userId: string): Promise<void> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (chat.type === 'private') {
      await this.messageModel.deleteMany({ chatId });
      await this.chatModel.findByIdAndDelete(chatId);
    } else {
      if (chat.members[0].toString() !== userId) throw new BadRequestException('Only the group creator can delete this group');
      await this.messageModel.deleteMany({ chatId });
      await this.chatModel.findByIdAndDelete(chatId);
    }
  }

  async leaveGroup(chatId: string, userId: string): Promise<void> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Group not found');

    chat.members = chat.members.filter(member => member.toString() !== userId);

    if (chat.members.length === 0) {
      await this.messageModel.deleteMany({ chatId });
      await this.chatModel.findByIdAndDelete(chatId);
    } else if (chat.members[0].toString() === userId) {
      chat.members[0] = chat.members[1];
    }
    await chat.save();
  }

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: any) {
    const { userId, chatId } = client.handshake.query;
    if (chatId) client.join(chatId);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
}