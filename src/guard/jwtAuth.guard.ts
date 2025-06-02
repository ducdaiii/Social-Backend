import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Lấy token từ cookie tên 'accessToken'
    const token = request.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('Token missing in cookies');
    }

    try {
      const publicKey = this.configService.publicKey;

      // Verify token với RS256 và public key
      const decoded = this.jwtService.verify(token, {
        algorithms: ['RS256'],
        publicKey: publicKey,
      });

      // Gán dữ liệu user vào request để controller có thể truy cập
      request.user = decoded;

      return true; // Cho phép tiếp tục request
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}