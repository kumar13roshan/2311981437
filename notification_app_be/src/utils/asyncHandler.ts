import type { NextFunction, Request, Response } from 'express';

export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};
