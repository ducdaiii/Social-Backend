import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenKeyService } from '../auth/tokenKey.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private keyStoreService: TokenKeyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token: string | undefined;
      let tokenType: 'accessToken' | 'refreshToken' | null = null;

      const accessToken = req.cookies?.accessToken;
      const refreshToken = req.cookies?.refreshToken;

      if (accessToken) {
        token = accessToken;
        tokenType = 'accessToken';
      } else if (refreshToken) {
        token = refreshToken;
        tokenType = 'refreshToken';
      }

      if (!token || !tokenType) {
        return res.status(401).json({ message: 'missing token' });
      }

      // Decode không verify để lấy userId
      const decodedUnverified = jwt.decode(token) as jwt.JwtPayload;
      if (!decodedUnverified?.sub) {
        return res.status(401).json({ message: 'invalid token' });
      }

      const userId = decodedUnverified.sub;

      // Lấy key từ DB theo userId
      const keyStore = await this.keyStoreService.findKeyByUserId(userId);
      if (!keyStore) {
        return res.status(403).json({ message: 'keystore not found' });
      }

      // Xác thực chữ ký token
      let decoded: jwt.JwtPayload;
      try {
        decoded = jwt.verify(token, keyStore.publicKey) as jwt.JwtPayload;
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'jwt expired' });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'invalid token' });
        } else if (err.name === 'NotBeforeError') {
          return res.status(401).json({ message: 'token not active yet' });
        }

        // Lỗi không xác định
        return res.status(403).json({ message: 'token verification failed' });
      }

      // Kiểm tra sub trùng khớp
      if (tokenType === 'refreshToken' && decoded.sub !== userId) {
        return res.status(403).json({ message: 'user id mismatch' });
      }

      // Gắn thông tin user vào req
      req.user = decoded.sub;
      next();
    } catch (error: any) {
      console.error('Unexpected error in auth middleware:', error);
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}