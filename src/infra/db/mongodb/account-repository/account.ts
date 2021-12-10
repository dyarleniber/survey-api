import { Collection, ObjectId } from 'mongodb';
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { AddAccountModel } from '../../../../domain/use-cases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('accounts');
  }

  private async getById(_id: ObjectId): Promise<AccountModel> {
    const accountCollection = await this.getCollection();
    const account = await accountCollection.findOne<AccountModel>({ _id });
    return <AccountModel>MongoHelper.map(account);
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await this.getCollection();
    const { insertedId } = await accountCollection.insertOne(accountData);
    return this.getById(insertedId);
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await this.getCollection();
    const account = await accountCollection.findOne<AccountModel>({ email });
    return account && <AccountModel>MongoHelper.map(account);
  }
}
