import { Controller } from '../../../presentation/protocols';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter';
import { makeLoginValidation } from './login-validation-factory';
import env from '../../config/env';

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const authentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
  const validation = makeLoginValidation();
  const loginController = new LoginController(authentication, validation);
  const logRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logRepository);
};
