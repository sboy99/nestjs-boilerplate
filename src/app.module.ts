import { CacheModule } from '@app/infra/cache';
import { ConfigModule } from '@app/infra/config';
import { DatabaseModule } from '@app/infra/database';
import { LoggerModule } from '@app/infra/logger';
import { SearchModule } from '@app/infra/search';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CacheModule,
    SearchModule,
    LoggerModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
