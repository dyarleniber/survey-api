import {
  AddAccount, AddAccountModel, AccountModel, Encryptor, AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly encryptor: Encryptor;

  private readonly addAccountRepository: AddAccountRepository;

  constructor(encryptor: Encryptor, addAccountRepository: AddAccountRepository) {
    this.encryptor = encryptor;
    this.addAccountRepository = addAccountRepository;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encryptor.encrypt(account.password);
    return this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    });
  }
}
