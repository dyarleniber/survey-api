import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { badRequest, ok, serverError } from '../../helpers';
import { MissingParamError } from '../../errors';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      return ok({});
    } catch (error) {
      return serverError(error);
    }
  }
}
