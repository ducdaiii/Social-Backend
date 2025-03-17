import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  public readonly privateKey: string;
  public readonly publicKey: string;

  constructor(private configService: NestConfigService) {
    this.privateKey = fs.readFileSync(path.join(__dirname, '../../src/key/keys/private.pem'), 'utf8');
    this.publicKey = fs.readFileSync(path.join(__dirname, '../../src/key/keys/public.pem'), 'utf8');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN');
  }

  // 📡 Crypto API
  get cryptoApiUrl(): string {
    return this.configService.get<string>('API_URL');
  }

  get cryptoApiKey(): string {
    return this.configService.get<string>('API_KEY');
  }

  // 🔗 QuickNode
  get quickNodeRpcUrl(): string {
    return this.configService.get<string>('RPC_URL');
  }

  // 📈 Binance API
  get binanceApiUrl(): string {
    return this.configService.get<string>('BINANCE_API_URL');
  }

  get binanceApiKey(): string {
    return this.configService.get<string>('API_BINANCE_KEY');
  }

  get binanceApiSecret(): string {
    return this.configService.get<string>('API_BINANCE_SECRET');
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
  }
}