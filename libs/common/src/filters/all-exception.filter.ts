import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionHandler');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    const path = req.originalUrl;
    const time = new Date(Date.now());
    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] | Record<string, string> = 'Something went wrong';
    let error: unknown;
    /**
     * If exception is a HttpException
     */
    if (exception instanceof HttpException) {
      error = exception.getResponse();
      statusCode = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof ZodError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Data validation exception';
      error = exception.errors.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {});
    }

    /**
     * Build the Exception payload
     */
    const exceptionPayload = {
      statusCode,
      message,
      error,
      path,
      time,
    };

    // console.log(exceptionPayload);
    this.logger.error((exception as any).message);
    httpAdapter.reply(ctx.getResponse(), exceptionPayload, statusCode);
  }
}
