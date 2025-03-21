import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: CreateUserDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    const { refreshToken } = refreshDto;
    try {
      return this.authService.refreshTokens(refreshToken);
    } catch (error) {
      throw new HttpException('Refresh token không hợp lệ', HttpStatus.UNAUTHORIZED);
    }
  }
}