import { exceptionFactory } from '@app/common/utils';
import type { TAppConfig } from '@app/infra/config';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  // enable cors
  app.enableCors({
    origin: [],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  // cofiguration
  const configService = app.get<ConfigService<TAppConfig>>(ConfigService);

  // initialize input validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory,
    })
  );

  // initialize logger
  app.useLogger(app.get(Logger));
  const logger = app.get(Logger);

  // http
  const port = configService.getOrThrow<string>('APP_HTTP_PORT');
  await app.listen(port);
  logger.log(`Api is running on port: ${port}`);
}
bootstrap();
