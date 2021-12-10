import { Controller } from '../../../presentation/protocols';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/use-cases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';
import env from '../../config/env';

export const makeSignUpController = (): Controller => {
  const hashGenerator = new BcryptAdapter(env.bcryptSalt);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(hashGenerator, addAccountRepository);
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(addAccount, validation);
  const logRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logRepository);
};
