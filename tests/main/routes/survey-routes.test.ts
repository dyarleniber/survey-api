import { Collection } from 'mongodb';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import app from '../../../src/main/config/app';
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper';
import env from '../../../src/main/config/env';

let accountCollection: Collection;
let surveyCollection: Collection;

const makeAccessToken = async (role?: string): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashedPassword',
    role,
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
  return accessToken;
};

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
      const accessToken = await makeAccessToken('admin');
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

  describe('GET /surveys', () => {
    test('should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403);
    });

    test('should return 403 on load surveys with invalid accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', 'invalid_token')
        .expect(403);
    });

    test('should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await surveyCollection.insertMany([{
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image_url',
        }, {
          answer: 'Answer 2',
        }],
        date: new Date(),
      }, {
        question: 'Question 2',
        answers: [{
          answer: 'Answer 1',
          image: 'image_url',
        }, {
          answer: 'Answer 2',
        }],
        date: new Date(),
      }]);
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
