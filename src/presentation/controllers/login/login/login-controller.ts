import {
  Authentication, Controller, HttpRequest, HttpResponse, Validation,
} from './login-controller-protocols';
import {
  badRequest, ok, serverError, unauthorized,
} from '@/presentation/helpers/http/http-helpers';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { email, password } = httpRequest.body;
      const authentication = await this.authentication.auth({ email, password });
      if (!authentication?.accessToken) {
        return unauthorized();
      }
      return ok(authentication);
    } catch (error) {
      return serverError(error);
    }
  }
}
