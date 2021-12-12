import { Controller } from '../../../../presentation/protocols';
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller';
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeLoginController = (): Controller => {
  const authentication = makeDbAuthentication();
  const validation = makeLoginValidation();
  const loginController = new LoginController(authentication, validation);
  return makeLogControllerDecorator(loginController);
};
