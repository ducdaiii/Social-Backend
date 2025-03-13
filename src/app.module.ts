import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoService } from './crypto/crypto.service';
import { CryptoController } from './crypto/crypto.controller';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  controllers: [AppController, CryptoController],
  providers: [AppService, CryptoService],
})
export class AppModule {}
