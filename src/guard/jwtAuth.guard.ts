import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const publicKey = this.configService.publicKey; 
      const decoded = this.jwtService.verify(token, {
        algorithms: ['RS256'],  
        publicKey: publicKey,
      });

      request.user = decoded; 
      return true;  
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');  
    }
  }
}