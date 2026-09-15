import pino from 'pino';
import { config } from './config';

export const logger = pino({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',

  // Human-readable output in development, raw JSON in production
  transport:
    config.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
