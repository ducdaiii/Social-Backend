import { Controller, Get, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('/all')
  async getAllCrypto() {
    return this.cryptoService.getAllCrypto();
  }

  @Get('symbol')
  async getCryptoBySymbol(@Query('symbol') symbol: string) {
    return this.cryptoService.getCryptoBySymbol(symbol);
  }
}