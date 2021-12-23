import { LoadAccountByToken } from '@/domain/use-cases/load-account-by-token';
import { DbLoadAccountByToken } from '@/data/use-cases/load-account-by-token/db-load-account-by-token';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter';
import env from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
