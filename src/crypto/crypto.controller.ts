import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('metadata-info')
  async getMetadataList() {
    return this.cryptoService.getBlockchainAssets();
  }

  @Get('asset-info')
  async getAssetInfo(assetSymbol : string) {
    return this.cryptoService.getAssetDetailsBySymbol(assetSymbol);
  }
}
