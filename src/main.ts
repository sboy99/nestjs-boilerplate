import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  // logger
  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
bootstrap();
