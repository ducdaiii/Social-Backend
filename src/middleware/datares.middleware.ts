import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EmptyDataMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;

    res.json = function (data) {
      // Chỉ trả 404 nếu data === null, undefined, hoặc là mảng rỗng
      const isEmptyArray = Array.isArray(data) && data.length === 0;
      const isNullish = data === null || data === undefined;

      if (isNullish || isEmptyArray) {
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