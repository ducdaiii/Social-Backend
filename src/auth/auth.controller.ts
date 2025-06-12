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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { LoginDto } from 'src/user/dto/login.dto';
import { TokenKeyService } from './tokenKey.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly keyStoreService: TokenKeyService,
  ) {}

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

  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tokens = await this.authService.exchangeGithubCodeForTokens(code);

      this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return { message: 'Authenticated successfully' }; 
    } catch (error) {
      throw new UnauthorizedException('GitHub auth failed');
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
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Thiếu refresh token');
    }

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
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken) {
      try {
        // Giải mã lấy userId từ refreshToken (bạn dùng jwt.decode nhé)
        const decoded: any = jwt.decode(refreshToken);
        if (decoded?.sub) {
          await this.keyStoreService.removeKey(decoded.sub);
        }
      } catch (e) {
        console.warn('Không thể xóa keystore:', e.message);
      }
    }

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

    return { message: 'Đăng xuất thành công' };
  }
}
