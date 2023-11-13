import { AllExceptionsFilter } from '@app/common/filters';
import { exceptionFactory } from '@app/common/utils';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  // initialize exception handler
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // initialize logger
  app.useLogger(app.get(Logger));

  // initialize input validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory,
    })
  );

  await app.listen(3000);
}
bootstrap();
