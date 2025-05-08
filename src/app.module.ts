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
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';

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
    UserModule,
    RedisModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, RedisService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmptyDataMiddleware, AuthMiddleware)  
      .exclude('auth/login', 'auth/register', "auth/logout", 'crypto/all', 'crypto/symbol', 'auth/google', 'auth/google/callback')  
      .forRoutes('*');     
  }
}