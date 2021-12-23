import { Controller } from '@/presentation/protocols';
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import { makeDbAddAccount } from '@/main/factories/use-cases/account/add-account/db-add-account-factory';
import { makeDbAuthentication } from '@/main/factories/use-cases/account/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const addAccount = makeDbAddAccount();
  const authentication = makeDbAuthentication();
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(addAccount, authentication, validation);
  return makeLogControllerDecorator(signUpController);
};
