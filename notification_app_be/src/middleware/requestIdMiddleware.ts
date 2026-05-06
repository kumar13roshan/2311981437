import type { NextFunction, Request, Response } from 'express';
import { createRequestId } from '../utils/requestId';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = String(req.headers['x-request-id'] || createRequestId());
  req.headers['x-request-id'] = requestId;
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
