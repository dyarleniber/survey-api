import { Controller } from '@/presentation/protocols';
import { LoginController } from '@/presentation/controllers/login/login/login-controller';
import { makeDbAuthentication } from '@/main/factories/use-cases/account/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): Controller => {
  const authentication = makeDbAuthentication();
  const validation = makeLoginValidation();
  const loginController = new LoginController(authentication, validation);
  return makeLogControllerDecorator(loginController);
};
