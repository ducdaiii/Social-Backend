import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './role.service';
import { Role, RoleSchema } from './schema/role.schema';
import { RolesController } from './role.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    forwardRef(() => ConfigModule),
  ],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}