import { Collection } from 'mongodb';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../../src/main/config/app';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper';
import env from '../../../src/main/config/env';

let accountCollection: Collection;

describe('Login routes', () => {
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

  describe('POST /signup', () => {
    test('should return 200 on signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('should return 200 on login success', async () => {
      const hashedPassword = await bcrypt.hash('any_password', env.bcryptSalt);
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: hashedPassword,
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password',
        })
        .expect(200);
    });

    test('should return 401 on login failure', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password',
        })
        .expect(401);
    });
  });
});
