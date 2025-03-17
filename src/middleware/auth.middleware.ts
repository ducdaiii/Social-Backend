import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenKeyService } from '../auth/tokenKey.service';
import { HEADER } from '../common/index';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private keyStoreService: TokenKeyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token: string | undefined;
      let tokenType: 'access' | 'refresh' | null = null;

      // Kiểm tra xem có Access Token hay Refresh Token không
      const accessToken = req.get(HEADER.AUTHORIZATION)?.split(' ')[1];
      const refreshToken = req.get(HEADER.REFRESHTOKEN);

      if (accessToken) {
        token = accessToken;
        tokenType = 'access';
      } else if (refreshToken) {
        token = refreshToken;
        tokenType = 'refresh';
      }

      if (!token || !tokenType) {
        throw new ForbiddenException('Thiếu Token');
      }

      const userId = req.get(HEADER.CLIENT_ID);
      if (!userId) {
        throw new ForbiddenException('Thiếu Client ID');
      }

      const keyStore = await this.keyStoreService.findKeyByUserId(userId);
      if (!keyStore) {
        throw new ForbiddenException('Không tìm thấy keystore');
      }

      const decoded: any = jwt.verify(token, keyStore.publicKey);
      console.log('Decoded Token:', decoded);

      if (tokenType === 'refresh' && decoded.user._id !== userId) {
        throw new ForbiddenException('User ID không trùng khớp');
      }

      req.user = decoded.user;
      return next();
    } catch (error) {
      console.error(`Lỗi ${error.message}`);
      throw new ForbiddenException(`Lỗi Token: ${error.message}`);
    }
  }
}