import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { ok } from '@/presentation/helpers/http/http-helpers';

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(_data: HttpRequest): Promise<HttpResponse> {
      return ok('any_body');
    }
  }
  return new ControllerStub();
};
