import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import type { TElkConfig } from '../config';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TElkConfig>) => ({
        node: configService.getOrThrow<string>('ELASTIC_SEARCH_NODE'),
        auth: {
          username: configService.getOrThrow<string>('ELASTIC_SEARCH_USER'),
          password: configService.getOrThrow<string>('ELASTIC_SEARCH_PASSWORD'),
        },
        maxRetries: 10,
        requestTimeout: 50000,
      }),
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
