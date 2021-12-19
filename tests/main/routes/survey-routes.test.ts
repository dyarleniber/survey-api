import { Collection } from 'mongodb';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import app from '../../../src/main/config/app';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper';
import env from '../../../src/main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey routes', () => {
  beforeAll(async (): Promise<void> => {
    await MongoHelper.connect(<string>process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('POST /surveys', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'image_url',
          }, {
            answer: 'Answer 2',
          }],
        })
        .expect(403);
    });

    test('should return 204 on add survey with valid accessToken', async () => {
      const { insertedId } = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashedPassword',
        role: 'admin',
      });
      const accessToken = sign({ id: insertedId.toHexString() }, env.jwtSecret);
      await accountCollection.updateOne(
        {
          _id: insertedId,
        },
        {
          $set: {
            accessToken,
          },
        },
      );
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'image_url',
          }, {
            answer: 'Answer 2',
          }],
        })
        .expect(204);
    });

    test('should return 403 on add survey with invalid accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', 'invalid_token')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'image_url',
          }, {
            answer: 'Answer 2',
          }],
        })
        .expect(403);
    });
  });
});
