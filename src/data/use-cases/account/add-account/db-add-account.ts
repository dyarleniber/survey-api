import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  HashGenerator,
  LoadAccountByEmailRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hashGenerator: HashGenerator,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(account: AddAccountParams): Promise<AccountModel | null> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(account.email);
    if (!existingAccount) {
      const hashedPassword = await this.hashGenerator.hash(account.password);
      return this.addAccountRepository.add({
        ...account,
        password: hashedPassword,
      });
    }
    return null;
  }
}
