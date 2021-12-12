import { Controller } from '../../../presentation/protocols';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { DbAddAccount } from '../../../data/use-cases/add-account/db-add-account';
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter';
import { makeSignUpValidation } from './signup-validation-factory';
import env from '../../config/env';

export const makeSignUpController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const authentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(addAccount, authentication, validation);
  const logRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logRepository);
};
