import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const asyncJsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export function createAppLogger() {
  return WinstonModule.createLogger({
    level: 'info', // base level, runtime controlled elsewhere
    format: asyncJsonFormat,
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
    exitOnError: false,
  });
}
