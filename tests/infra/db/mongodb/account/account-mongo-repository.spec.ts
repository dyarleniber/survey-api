import { Collection } from 'mongodb';
import { AccountMongoRepository } from '../../../../../src/infra/db/mongodb/account/account-mongo-repository';
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper';

const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async (): Promise<void> => {
    await MongoHelper.connect(<string>process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
      });
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('hashed_password');
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
      });
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('hashed_password');
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('wrong_email@mail.com');
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update the access token on updateAccessToken success', async () => {
      const sut = makeSut();
      const { insertedId } = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
      });
      await sut.updateAccessToken(insertedId.toHexString(), 'any_token');
      const account = await accountCollection.findOne({ _id: insertedId });
      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe('any_token');
    });
  });
});
