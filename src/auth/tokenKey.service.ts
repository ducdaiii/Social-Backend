import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenKey, TokenKeyDocument } from './schema/tokenKey.schema';

@Injectable()
export class TokenKeyService {
  constructor(@InjectModel(TokenKey.name) private tokenKeyModel: Model<TokenKeyDocument>) {}

  // 🔹 Lưu mới hoặc cập nhật khóa RSA và Refresh Token
  async saveOrUpdateKeyPair(userId: string, publicKey: string, privateKey: string, refreshToken: string) {
    const keyStore = await this.tokenKeyModel.findOneAndUpdate(
      { userId },
      { publicKey, privateKey, refreshToken },
      { new: true, upsert: true } // Tự động tạo mới nếu chưa tồn tại
    );

    return { message: 'Lưu hoặc cập nhật khóa thành công', keyStore };
  }

  // 🔹 Tìm khóa của một người dùng
  async findKeyByUserId(userId: string) {
    const keyStore = await this.tokenKeyModel.findOne({ userId });
    if (!keyStore) throw new NotFoundException('Không tìm thấy khóa RSA');
    return keyStore;
  }

  // 🔹 Lấy Private Key
  async getPrivateKey(userId: string) {
    return (await this.findKeyByUserId(userId)).privateKey;
  }

  // 🔹 Lấy Public Key
  async getPublicKey(userId: string) {
    return (await this.findKeyByUserId(userId)).publicKey;
  }

  // 🔹 Kiểm tra Refresh Token có hợp lệ không
  async validateRefreshToken(userId: string, refreshToken: string) {
    const keyStore = await this.findKeyByUserId(userId);
    if (keyStore.refreshToken !== refreshToken) {
      throw new NotFoundException('Refresh Token không hợp lệ');
    }
    return true;
  }

  // 🔹 Xóa khóa khi user đăng xuất hoặc bị thu hồi token
  async removeKey(userId: string) {
    const result = await this.tokenKeyModel.deleteOne({ userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Không tìm thấy khóa để xóa');
    }
    return { message: 'Xóa khóa thành công' };
  }
}