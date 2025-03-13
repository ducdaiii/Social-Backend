import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CryptoService {
  private readonly API_URL = process.env.API_URL;
  private readonly API_KEY = process.env.API_KEY;

  async getBlockchainAssets(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.API_URL}/market-data/metadata/assets`,
        {
          headers: { 'X-API-Key': this.API_KEY },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'API Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAssetDetailsBySymbol(assetSymbol: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.API_URL}/market-data/assets/by-symbol/${assetSymbol}`,
        {
          headers: { 'X-API-Key': this.API_KEY },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'API Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
