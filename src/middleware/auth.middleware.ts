import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenKeyService } from '../auth/tokenKey.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private keyStoreService: TokenKeyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token: string | undefined;
      let tokenType: 'access' | 'refresh' | null = null;

      // Lấy token từ cookie
      const accessToken = req.cookies?.accessToken;
      const refreshToken = req.cookies?.refreshToken;

      if (accessToken) {
        token = accessToken;
        tokenType = 'access';
      } else if (refreshToken) {
        token = refreshToken;
        tokenType = 'refresh';
      }

      if (!token || !tokenType) {
        return res.status(403).json({ message: 'Thiếu Token' });
      }

      // Giải mã token chưa verify để lấy userId
      const decodedUnverified: any = jwt.decode(token);
      if (!decodedUnverified?.sub) {
        throw res.status(403).json({ message: 'Token không hợp lệ' });
      }
      const userId = decodedUnverified.sub;

      // Tìm keyStore dựa trên userId lấy được từ token
      const keyStore = await this.keyStoreService.findKeyByUserId(userId);
      if (!keyStore) {
        throw res.status(403).json({ message: 'Không tìm thấy keystore' });
      }
      // Xác thực token bằng publicKey
      const decoded: any = jwt.verify(token, keyStore.publicKey);

      // Nếu là refresh token, đảm bảo userId trùng khớp
      if (tokenType === 'refresh' && decoded.sub !== userId) {
        throw res.status(403).json({ message: 'User ID không trùng khớp' });
      }

      req.user = decoded.sub;
      return next();
    } catch (error) {
      console.error(`Lỗi ${error.message}`);
      return res.status(403).json({ message: `Lỗi Token: ${error.message}` });
    }
  }
}
