import { PostgresConfig } from '@app/common/configs';
import { DatabaseModule, LoggerModule } from '@app/infra';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: PostgresConfig,
      validate: (config) => PostgresConfig.parse(config),
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
  ],
})
export class AppModule {}
