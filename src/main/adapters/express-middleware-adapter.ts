import { Request, Response, NextFunction } from 'express';
import { Middleware, HttpRequest } from '../../presentation/protocols';

export const expressMiddlewareAdapter = (
  middleware: Middleware,
) => async (req: Request, res: Response, next: NextFunction) => {
  const httpRequest: HttpRequest = {
    headers: req.headers,
  };
  const httpResponse = await middleware.handle(httpRequest);
  if (httpResponse.statusCode === 200) {
    Object.assign(req, httpResponse.body);
    next();
  } else {
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body?.message,
    });
  }
};
