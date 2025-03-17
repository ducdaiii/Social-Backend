import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('metadata-info')
  async getMetadataList() {
    return this.cryptoService.getBlockchainAssets();
  }

  @Get('asset-info/:assetSymbol')
  async getAssetInfo(@Param('assetSymbol') assetSymbol) {
    if (!assetSymbol) {
      throw new HttpException('Missing assetSymbol', HttpStatus.BAD_REQUEST);
    }
    return this.cryptoService.getAssetDetailsBySymbol(assetSymbol);
  }
}
