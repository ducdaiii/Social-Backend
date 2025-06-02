import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './middleware/http.middleware';

async function bootstrap() {
  // Load biến môi trường từ .env
  config();

  const app = await NestFactory.create(AppModule);

  // Thiết lập bảo mật HTTP headers
  app.use(helmet());

  // Dùng cookie-parser để đọc cookies từ request
  app.use(cookieParser());

  // Cấu hình CORS cho phép gửi cookies từ frontend
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalFilters(
    new (class {
      catch(exception, host) {
        console.error('⚠️ Global exception:', exception);
      }
    })(),
  );

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ extended: true, limit: '500mb' }));

  // Mở cổng
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
}
bootstrap();
