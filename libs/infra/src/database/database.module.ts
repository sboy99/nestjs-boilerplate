import type { TMongoConfig } from '@app/common/configs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ModelDefinition } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<TMongoConfig>) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
