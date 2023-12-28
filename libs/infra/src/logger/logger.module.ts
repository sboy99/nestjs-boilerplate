import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
        },
        formatters: {
          bindings: (bindings) => {
            return {
              pid: bindings.pid,
            };
          },
          level: (label) => {
            return { level: label.toUpperCase() };
          },
        },

        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
      },
    }),
  ],
})
export class LoggerModule {}
