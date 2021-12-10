import {
  AddAccount, AddAccountModel, AccountModel, HashGenerator, AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hashGenerator: HashGenerator,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hashGenerator.hash(account.password);
    return this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    });
  }
}
