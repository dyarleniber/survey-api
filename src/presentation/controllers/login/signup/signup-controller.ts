import {
  AddAccount,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './signup-controller-protocols';
import {
  badRequest, forbidden, ok, serverError,
} from '@/presentation/helpers/http/http-helpers';
import { EmailInUseError } from '@/presentation/errors';

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
      const account = await this.addAccount.add({ name, email, password });
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const authentication = await this.authentication.auth({ email, password });
      return ok(authentication);
    } catch (error) {
      return serverError(error);
    }
  }
}
