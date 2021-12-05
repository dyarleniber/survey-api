import { HttpResponse } from '../protocols';
import { ServerError, UnauthorizedError } from '../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error?: Error | unknown): HttpResponse => {
  const stack = error instanceof Error ? error?.stack : undefined;
  return {
    statusCode: 500,
    body: new ServerError(stack),
  };
};

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});
