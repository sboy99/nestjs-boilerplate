import { ConfigModule } from '@app/infra/config';
import { DatabaseModule } from '@app/infra/database';
import { LoggerModule } from '@app/infra/logger';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
