// Import như cũ
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { Request } from 'express';

import { User, UserDocument } from '../user/schema/user.schema';
import { CreateUserDto } from '../user/dto/user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { TokenKeyService } from './tokenKey.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private tokenKeyService: TokenKeyService,
    private mailService: MailService,
  ) {}

  // 🔹 Tạo cặp khóa RSA
  private generateRSAKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    return { publicKey, privateKey };
  }

  // 🔹 Tạo token
  private async generateTokens(user: UserDocument, privateKey: string) {
    const payload = { sub: user._id, username: user.email };

    const accessToken = this.jwtService.sign(payload, {
      algorithm: 'RS256',
      expiresIn: '15m',
      privateKey,
    });

    const refreshToken = this.jwtService.sign(payload, {
      algorithm: 'RS256',
      expiresIn: '7d',
      privateKey,
    });

    return { accessToken, refreshToken };
  }

  // 🔹 Đăng ký
  async register(registerDto: CreateUserDto, isSocialLogin = false) {
    const { email, password, username } = registerDto;

    if (await this.userModel.findOne({ email })) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = isSocialLogin
      ? password // Đã được dùng tạm, không mã hóa
      : await bcrypt.hash(password, 10);

    const user = new this.userModel({ email, password: hashedPassword, username });
    await user.save();

    const { publicKey, privateKey } = this.generateRSAKeys();
    const tokens = await this.generateTokens(user, privateKey);

    await this.tokenKeyService.saveOrUpdateKeyPair(
      user._id.toString(),
      publicKey,
      privateKey,
      tokens.refreshToken,
    );

    return tokens;
  }

  // 🔹 Đăng nhập
  async login(loginDto: LoginDto, isSocialLogin = false) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    if (!isSocialLogin) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu không đúng');
      }
    }

    let keyData = await this.tokenKeyService.findKeyByUserId(user._id.toString()).catch(() => null);

    if (!keyData) {
      const { publicKey, privateKey } = this.generateRSAKeys();
      const tokensTemp = await this.generateTokens(user, privateKey);

      await this.tokenKeyService.saveOrUpdateKeyPair(
        user._id.toString(),
        publicKey,
        privateKey,
        tokensTemp.refreshToken,
      );

      keyData = await this.tokenKeyService.findKeyByUserId(user._id.toString());
    }

    const tokens = await this.generateTokens(user, keyData.privateKey);

    await this.tokenKeyService.saveOrUpdateKeyPair(
      user._id.toString(),
      keyData.publicKey,
      keyData.privateKey,
      tokens.refreshToken,
    );

    return tokens;
  }

  // 🔹 Refresh token
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as { sub: string };
      const user = await this.userModel.findById(decoded.sub);
      if (!user) throw new NotFoundException('Người dùng không tồn tại');

      const keyData = await this.tokenKeyService.findKeyByUserId(user._id.toString());
      return this.generateTokens(user, keyData.privateKey);
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  // 🔹 Xác thực GitHub
  async exchangeGithubCodeForTokens(code: string) {
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3000/auth/github/callback',
      },
      { headers: { Accept: 'application/json' } },
    );

    const githubUser = await this.getGithubUserProfile(data.access_token);
    return this.validateGithubUser(githubUser, data.access_token);
  }

  async getGithubUserProfile(accessToken: string) {
    const { data } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });
    return data;
  }

  async getGithubPrimaryEmail(accessToken: string): Promise<string> {
    const { data } = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const primaryEmail = data.find(
      (email: any) => email.primary && email.verified,
    );
    return primaryEmail?.email || '';
  }

  async validateGithubUser(profile: any, accessToken: string) {
    const { id: githubId, login, email } = profile;
    const resolvedEmail =
      email || (await this.getGithubPrimaryEmail(accessToken)) || `${login}@github.com`;

    let user = await this.userModel.findOne({ email: resolvedEmail });

    if (!user) {
      await this.register(
        {
          email: resolvedEmail,
          password: githubId, // Không mã hóa
          username: login,
        },
        true,
      );
      user = await this.userModel.findOne({ email: resolvedEmail });
    }

    const key = await this.tokenKeyService.findKeyByUserId(user._id.toString()).catch(() => null);

    if (!key) {
      const { publicKey, privateKey } = this.generateRSAKeys();
      const tokensTemp = await this.generateTokens(user, privateKey);

      await this.tokenKeyService.saveOrUpdateKeyPair(
        user._id.toString(),
        publicKey,
        privateKey,
        tokensTemp.refreshToken,
        accessToken,
      );
    } else {
      await this.tokenKeyService.updateGithubAccessToken(user._id.toString(), accessToken);
    }

    return this.login({ email: resolvedEmail, password: githubId }, true);
  }

  // 🔹 Xác thực Google
  async exchangeGoogleCodeForTokens(code: string) {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/auth/google/callback',
    });

    const googleUser = await this.getGoogleUserProfile(data.access_token);
    return this.validateGoogleUser(googleUser);
  }

  async getGoogleUserProfile(accessToken: string) {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return data;
  }

  async validateGoogleUser(profile: any) {
    const { id: googleId, email, name } = profile;

    let user = await this.userModel.findOne({ email });

    if (!user) {
      await this.register(
        {
          email,
          password: googleId,
          username: name || email.split('@')[0],
        },
        true,
      );
      user = await this.userModel.findOne({ email });
    }

    const key = await this.tokenKeyService.findKeyByUserId(user._id.toString()).catch(() => null);

    if (!key) {
      const { publicKey, privateKey } = this.generateRSAKeys();
      const tokensTemp = await this.generateTokens(user, privateKey);

      await this.tokenKeyService.saveOrUpdateKeyPair(
        user._id.toString(),
        publicKey,
        privateKey,
        tokensTemp.refreshToken,
      );
    }

    return this.login({ email, password: googleId }, true);
  }

  // 🔹 Get current user from JWT
  async getCurrentUser(req: Request) {
    const token = req.cookies?.accessToken;
    if (!token) throw new UnauthorizedException('Không tìm thấy access token');

    const decoded = this.jwtService.decode(token) as { sub: string };
    if (!decoded?.sub) throw new UnauthorizedException('Token không hợp lệ');

    const keyData = await this.tokenKeyService.findKeyByUserId(decoded.sub);
    if (!keyData) throw new UnauthorizedException('Không tìm thấy khóa xác thực');

    const verified = this.jwtService.verify(token, {
      publicKey: keyData.publicKey,
    });

    const user = await this.userModel.findById(decoded.sub).select('-password');
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    return user;
  }

  async invalidateRefreshToken(refreshToken: string) {
    await this.userModel.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
  }

  async verifyAccessToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token) as { sub: string };
      const keyData = await this.tokenKeyService.findKeyByUserId(decoded.sub);
      return this.jwtService.verify(token, { publicKey: keyData.publicKey });
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}