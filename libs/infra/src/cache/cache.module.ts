import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

import type { TRedisConfig } from '../config';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService<TRedisConfig>) => ({
        store: await redisStore({
          url: configService.getOrThrow<string>('REDIS_URI'),
          ttl: configService.getOrThrow<number>('DEFAULT_CACHE_TTL'),
        }),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
