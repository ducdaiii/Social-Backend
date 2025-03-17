import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('connect-meta/:address')
  async connectWallet(@Param('address') address: string) {
    return this.walletService.validateWallet(address);
  }

  @Get('meta')
  async getMetaTokens(@Query('address') address: string) {
    try {
      return await this.walletService.getMetaTokens(address);
    } catch (error) {
      console.error('Error fetching QuickNode data:', error.response?.data || error.message);
      throw new HttpException(error.response?.data || 'Error fetching data', error.response?.status || 500);
    }
  }

  @Get('binance')
  async getBinanceTokens(@Query('type') type: string) {
    try {
      return await this.walletService.getBinanceTokens(type);
    } catch (error) {
      console.error('Error fetching Binance API data:', error.response?.data || error.message);
      throw new HttpException(error.response?.data || 'Error fetching Binance data', error.response?.status || 500);
    }
  }
}