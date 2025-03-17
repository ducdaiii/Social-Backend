import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

@Injectable()
export class WalletService {
  private readonly QUICKNODE_API = process.env.RPC_URL;
  private readonly BINANCE_URL = process.env.BINANCE_API_URL;
  private readonly BINANCE_KEY = process.env.API_BINANCE_KEY;
  private readonly BINANCE_SECRET_KEY = process.env.API_BINANCE_SECRET;

  async validateWallet(
    address: string,
  ): Promise<{ message: string; address: string }> {
    if (!address) {
      throw new HttpException('Missing wallet address', HttpStatus.BAD_REQUEST);
    }

    // Kiểm tra xem địa chỉ có hợp lệ không
    if (!ethers.isAddress(address)) {
      throw new HttpException('Invalid wallet address', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Wallet connected successfully',
      address,
    };
  }

  async getMetaTokens(address: string) {
    if (!this.QUICKNODE_API) {
      throw new Error('URL is not defined.');
    }

    try {
      const response = await axios.post(this.QUICKNODE_API, {
        method: 'qn_getWalletTokenBalance',
        params: [{ wallet: address, perPage: 40, page: 1 }],
        id: 1,
        jsonrpc: '2.0',
      });

      return response.data.result;
    } catch (error) {
      console.error(
        'API request failed:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data || 'Failed to fetch tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBinanceTokens(type: string) {
    if (!this.BINANCE_KEY || !this.BINANCE_SECRET_KEY) {
      throw new HttpException('Binance API Key is not set', 500);
    }

    try {
      const timestamp = Date.now();
      const queryString = `type=${type}&timestamp=${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.BINANCE_SECRET_KEY)
        .update(queryString)
        .digest('hex');
      
      const response = await axios.get(`${this.BINANCE_URL}/sapi/v1/accountSnapshot`, {
        params: { type, timestamp, signature },
        headers: { 'X-MBX-APIKEY': this.BINANCE_KEY },
      });
      
      return response.data;
    } catch (error) {
      console.error('Binance API request failed:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || 'Error fetching Binance data',
        error.response?.status || 500
      );
    }
  }
}
