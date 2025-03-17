import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigModule } from '../config/config.module';
import { JwtService } from '@nestjs/jwt'; 
import { TokenKeyService } from './tokenKey.service';
import { TokenKey, TokenKeySchema } from './schema/tokenKey.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: TokenKey.name, schema: TokenKeySchema }]),
    PassportModule,
    forwardRef(() => ConfigModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, JwtService, TokenKeyService],
  exports: [AuthService, TokenKeyService]
})
export class AuthModule {}
