import {
  Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication,
} from './signup-controller-protocols';
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { name, email, password } = httpRequest.body;
      await this.addAccount.add({ name, email, password });
      const accessToken = await this.authentication.auth({ email, password });
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
