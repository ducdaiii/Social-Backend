import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { Chat, ChatSchema } from './schema/chat.schema';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
    RedisModule,
  ],
  providers: [ChattingService],
  controllers: [ChattingController],
  exports: [ChattingService],
})
export class ChattingModule {}