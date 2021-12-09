import { Collection, ObjectId } from 'mongodb';
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AddAccountModel } from '../../../../domain/use-cases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
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
}
