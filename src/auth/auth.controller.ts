import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { LoginDto } from 'src/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getProfile(@Req() req: Request) {
    return this.authService.getCurrentUser(req);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  async googleAuthRedirect(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.exchangeGoogleCodeForTokens(code);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { message: 'Google login successful' };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  async githubAuthRedirect(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tokens = await this.authService.exchangeGithubCodeForTokens(code);

      this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return { message: 'GitHub login successful' };
    } catch {
      throw new HttpException(
        'Đăng nhập GitHub thất bại',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('register')
  async register(
    @Body() registerDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(registerDto);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { message: 'Register successful' };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { message: 'Login successful' };
  }

  @Post('refresh')
  async refresh(
    @Body() refreshDto: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = refreshDto;

    try {
      const tokens = await this.authService.refreshTokens(refreshToken);

      this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return { message: 'Token refreshed' };
    } catch (error) {
      throw new HttpException(
        'Refresh token không hợp lệ',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true, 
      sameSite: 'lax', 
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }
}
