import { SignUpController } from '../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log-controller-decorator';
import { Controller } from '../../presentation/protocols';

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const encryptor = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encryptor, addAccountRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator(signUpController);
};
