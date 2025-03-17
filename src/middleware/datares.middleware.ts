import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EmptyDataMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Lưu hàm gốc để ghi đè sau
    const originalJson = res.json;

    res.json = function (data) {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).json({
          statusCode: 404,
          message: 'No data found',
        });
      }
      return originalJson.call(this, data);
    };

    next();
  }
}