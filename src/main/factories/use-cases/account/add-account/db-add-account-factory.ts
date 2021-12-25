import { AddAccount } from '@/domain/use-cases/account/add-account';
import { DbAddAccount } from '@/data/use-cases/account/add-account/db-add-account';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter';
import env from '@/main/config/env';

export const makeDbAddAccount = (): AddAccount => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt);
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);
};
