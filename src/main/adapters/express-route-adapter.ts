import { Request, Response } from 'express';
import { Controller, HttpRequest } from '@/presentation/protocols';

export const expressRouteAdapter = (
  controller: Controller,
) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    params: req.params,
    body: req.body,
    accountId: req.accountId,
  };
  const httpResponse = await controller.handle(httpRequest);
  if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body?.message,
    });
  }
};
