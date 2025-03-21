import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Tìm tất cả người dùng
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Tìm người dùng theo ID
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Cập nhật thông tin người dùng
  async update(id: string, updateUserDto: any): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  // Xóa người dùng
  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // Kiểm tra mật khẩu
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
