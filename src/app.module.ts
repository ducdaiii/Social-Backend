import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './role/role.module';
import { CommentModule } from './comment/comment.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { EmptyDataMiddleware } from './middleware/datares.middleware';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ProjectModule } from './post/post.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    DatabaseModule,
    UserModule,
    RolesModule,
    ProjectModule,
    CommentModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmptyDataMiddleware, AuthMiddleware)  
      .exclude('auth/login', 'auth/register', "auth/logout", 'auth/google', 'auth/google/callback', 'auth/github/callback', 'users', 'posts/random')
      .forRoutes('*');     
  }
}