import type { Response } from 'express';

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
  meta?: Record<string, unknown>,
): Response => res.status(statusCode).json({
  success: true,
  message,
  data,
  meta,
  timestamp: new Date().toISOString(),
  requestId: res.locals.requestId,
});

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown,
): Response => res.status(statusCode).json({
  success: false,
  message,
  details,
  timestamp: new Date().toISOString(),
  requestId: res.locals.requestId,
});
