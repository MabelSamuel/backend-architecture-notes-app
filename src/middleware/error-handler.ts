import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { AppError } from '../lib/errors';
import { config } from '../lib/config';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

// Must be registered last, after all routes, so it catches every error thrown above it.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  logger.error({
    event: 'request:error',
    method: req.method,
    url: req.url,
    statusCode,
    message,
    stack: config.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: {
      message: isAppError || config.NODE_ENV !== 'production' ? message : 'Internal server error',
    },
  });
}
