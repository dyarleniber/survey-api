import { SignUpController } from '../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter();
  const encryptor = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encryptor, addAccountRepository);
  return new SignUpController(emailValidator, addAccount);
};
