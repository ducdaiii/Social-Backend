import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Chat, ChatDocument } from '../chatting/schema/chat.schema';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getAllFollowedUsers(userId: string): Promise<User[]> {
    const user = await this.userModel
      .findById(userId)
      .populate<{ following: User[] }>('following')
      .exec();

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user.following;
  }

  async followUser(followerId: Types.ObjectId, followingId: Types.ObjectId) {
    const follower = await this.userModel.findById(followerId);
    const following = await this.userModel.findById(followingId);
  
    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }
  
    if (!follower.following.includes(followingId)) {
      follower.following.push(followingId);
      following.followers.push(followerId);
      
      await follower.save();
      await following.save();
  
      // Kiểm tra nếu chưa có chat thì tạo mới
      const existingChat = await this.chatModel.findOne({
        type: 'private',
        members: { $all: [followerId, followingId] },
      });
  
      if (!existingChat) {
        const newChat = await this.chatModel.create({
          type: 'private',
          members: [followerId, followingId],
        });
        console.log(`Created new chat for users: ${followerId} and ${followingId}`);
      }
    }
  }  

  async unfollowUser(userId: string, targetUserId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    user.following = user.following.filter(
      (id) => id.toString() !== targetUserId,
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId,
    );

    await user.save();
    await targetUser.save();

    return user;
  }
}