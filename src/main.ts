import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { HttpExceptionFilter } from './middleware/http.middleware';


async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  });
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.json({ limit: '500mb' }));
  
  await app.listen(8080);
}
bootstrap();
