import { MongoHelper } from '@/infra/db/mongodb/helpers';

const makeSut = () => MongoHelper;

describe('Mongo helper', () => {
  beforeAll(async (): Promise<void> => {
    await MongoHelper.connect(<string>process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    const sut = makeSut();
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
