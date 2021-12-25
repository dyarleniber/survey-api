import { Collection, ObjectId } from 'mongodb';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { AddAccountModel } from '@/domain/use-cases/account/add-account';
import { AccountModel } from '@/domain/models/account';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository {
  private async getCollection(): Promise<Collection> {
    return MongoHelper.getCollection('accounts');
  }

  private async getById(_id: ObjectId): Promise<AccountModel> {
    const accountCollection = await this.getCollection();
    const account = await accountCollection.findOne({ _id });
    return <AccountModel>MongoHelper.map(account);
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await this.getCollection();
    const { insertedId } = await accountCollection.insertOne(accountData);
    return this.getById(insertedId);
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await this.getCollection();
    const account = await accountCollection.findOne({ email });
    return account && <AccountModel>MongoHelper.map(account);
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel | null> {
    const accountCollection = await this.getCollection();
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        { role },
        { role: 'admin' },
      ],
    });
    return account && <AccountModel>MongoHelper.map(account);
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await this.getCollection();
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken } });
  }
}
