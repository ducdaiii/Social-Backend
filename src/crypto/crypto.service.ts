import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CryptoService {
  private readonly CMC_API_URL = process.env.API_URL;
  private readonly CMC_API_KEY = process.env.API_KEY;

  constructor() {
    if (!this.CMC_API_KEY) {
      throw new Error('❌ CMC_API_KEY chưa được cấu hình trong .env');
    }
  }

  async getAllCrypto(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.CMC_API_URL}cryptocurrency/listings/latest`,
        {
          headers: { 'X-CMC_PRO_API_KEY': this.CMC_API_KEY },
        },
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getCryptoBySymbol(symbol: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.CMC_API_URL}cryptocurrency/quotes/latest?symbol=${symbol}`,
        {
          headers: { 'X-CMC_PRO_API_KEY': this.CMC_API_KEY },
        },
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  // Xử lý lỗi API
  private handleApiError(error: any): never {
    const errorMessage =
      error.response?.data?.status?.error_message || error.message || 'API Error';
    throw new HttpException(
      {
        status: error.response?.status || HttpStatus.BAD_REQUEST,
        message: errorMessage,
        details: error.response?.data || null,
      },
      error.response?.status || HttpStatus.BAD_REQUEST,
    );
  }
}
