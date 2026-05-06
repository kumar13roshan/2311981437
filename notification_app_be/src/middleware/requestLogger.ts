import type { NextFunction, Request, Response } from 'express';
import { Log } from 'affordmed-logging-middleware';

export const requestLogger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const startedAt = Date.now();
  await Log('backend', 'info', 'middleware', `Route hit ${req.method} ${req.originalUrl} requestId=${res.locals.requestId}`);

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    void Log('backend', level, 'middleware', `Route completed ${req.method} ${req.originalUrl} status=${res.statusCode} durationMs=${durationMs}`);
  });

  next();
};
