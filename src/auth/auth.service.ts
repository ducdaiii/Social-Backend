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
import { User, UserDocument } from '../user/schema/user.schema';
import { CreateUserDto } from '../user/dto/user.dto';
import { TokenKeyService } from './tokenKey.service';
import axios from 'axios';
import { LoginDto } from 'src/user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private tokenKeyService: TokenKeyService,
  ) {}

  // 🔹 Đăng ký người dùng
  async register(registerDto: CreateUserDto) {
    const { email, password, username } = registerDto;

    // Kiểm tra nếu email đã tồn tại
    if (await this.userModel.findOne({ email })) {
      throw new UnauthorizedException('Email already exists');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng
    const user = new this.userModel({ email, password: hashedPassword, username });
    await user.save();


    // 🔹 Tạo và lưu khóa RSA
    const { publicKey, privateKey } = this.generateRSAKeys();
    const tokens = await this.generateTokens(user, privateKey);

    await this.tokenKeyService.saveOrUpdateKeyPair(user._id.toString(), publicKey, privateKey, tokens.refreshToken);

    return tokens;
  }

  // 🔹 Đăng nhập
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Kiểm tra người dùng có tồn tại
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Email không tồn tại');


    // Kiểm tra mật khẩu
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    // 🔹 Lấy privateKey từ database
    const keyData = await this.tokenKeyService.findKeyByUserId(user._id.toString());
    if (!keyData) throw new UnauthorizedException('Không tìm thấy khóa bảo mật');

    // Tạo token
    const tokens = await this.generateTokens(user, keyData.privateKey);

    // Cập nhật refreshToken
    await this.tokenKeyService.saveOrUpdateKeyPair(user._id.toString(), keyData.publicKey, keyData.privateKey, tokens.refreshToken);

    return tokens;
  }

  // 🔹 Tạo Access Token & Refresh Token
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

  // 🔹 Xác minh Access Token
  async verifyAccessToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token) as { sub: string };
      if (!decoded?.sub) throw new UnauthorizedException('Token không hợp lệ');

      // Lấy publicKey từ database
      const keyData = await this.tokenKeyService.findKeyByUserId(decoded.sub);
      if (!keyData) throw new UnauthorizedException('Không tìm thấy khóa bảo mật');

      return this.jwtService.verify(token, { publicKey: keyData.publicKey });
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // 🔹 Lấy lại Access Token thông qua Refresh Token
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.verifyAccessToken(refreshToken);

      // Tìm user từ token
      const user = await this.userModel.findById(decoded.sub);
      if (!user) throw new NotFoundException('Người dùng không tồn tại');

      // 🔹 Lấy privateKey từ database
      const keyData = await this.tokenKeyService.findKeyByUserId(user._id.toString());
      if (!keyData) throw new UnauthorizedException('Không tìm thấy khóa bảo mật');

      return this.generateTokens(user, keyData.privateKey);
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  // 🔹 Tạo cặp khóa RSA mới
  private generateRSAKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    return { publicKey, privateKey };
  }

  async invalidateRefreshToken(refreshToken: string) {
    await this.userModel.updateOne(
      { refreshToken },
      { $unset: { refreshToken: 1 } } 
    );
  }

  async validateGoogleUser(profile: any) {
    const { id: googleId, email, name } = profile;
  
    let user = await this.userModel.findOne({ email });
  
    if (!user) {
      await this.register({
        email,
        password: googleId,
        username: name || email.split('@')[0],
      });
    }
  
    return this.login({ email, password: googleId });
  }  

  async exchangeGoogleCodeForTokens(code: string) {
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/auth/google/callback',
      }
    );
  
    const googleUser = await this.getGoogleUserProfile(data.access_token);
    return this.validateGoogleUser(googleUser);
  }

  async getGoogleUserProfile(accessToken: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  }
}