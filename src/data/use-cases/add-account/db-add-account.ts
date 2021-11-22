import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account';
import { AccountModel } from '../../../domain/models/account';
import { Encryptor } from '../../protocols/encryptor';

export class DbAddAccount implements AddAccount {
  private readonly encryptor: Encryptor;

  constructor(encryptor: Encryptor) {
    this.encryptor = encryptor;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encryptor.encrypt(account.password);
    return {} as AccountModel;
  }
}
