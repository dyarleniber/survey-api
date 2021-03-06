import { Authentication } from '@/domain/use-cases/account/authentication';
import { DbAuthentication } from '@/data/use-cases/account/authentication/db-authentication';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter';
import env from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
};
