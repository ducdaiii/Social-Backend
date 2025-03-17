import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoModule } from './crypto/crypto.module';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ChattingModule } from './chatting/chatting.module';
import { RolesModule } from './role/role.module';
import { PostsModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { EmptyDataMiddleware } from './middleware/datares.middleware';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    CryptoModule,
    WalletModule,
    DatabaseModule,
    UserModule,
    ChattingModule,
    RolesModule,
    PostsModule,
    CommentModule,
    UserModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmptyDataMiddleware, AuthMiddleware)  
      .exclude('auth/login', 'auth/register', 'crypto/asset-info/:assetSymbol', 'crypto/metadata-info')  
      .forRoutes('*');     
  }
}