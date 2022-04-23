import { NextFunction, Request, Response } from 'express';

export const noCache = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
};
