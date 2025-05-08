import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const client = createClient({
          url: 'redis://localhost:6379', 
        });

        client.on('error', (err) => console.error('Redis Client Error', err));
        
        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService, REDIS_CLIENT], 
})
export class RedisModule {}