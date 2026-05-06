import type { NextFunction, Request, Response } from 'express';
import { Log } from 'affordmed-logging-middleware';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/responseFormatter';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = async (error: Error | AppError, req: Request, res: Response, _next: NextFunction): Promise<Response> => {
  const appError = error instanceof AppError ? error : new AppError('Internal server error', 500);
  await Log('backend', appError.statusCode >= 500 ? 'error' : 'warn', 'handler', `API failure ${req.method} ${req.originalUrl}: ${error.message}`);
  const details = env.nodeEnv === 'production' ? appError.details : appError.details || error.stack;
  return errorResponse(res, appError.statusCode, appError.message, details);
};
