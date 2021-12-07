import { Controller } from '../../../presentation/protocols';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/use-cases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const encryptor = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encryptor, addAccountRepository);
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(addAccount, validation);
  const logRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logRepository);
};
