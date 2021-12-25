import { Collection } from 'mongodb';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import env from '@/main/config/env';

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

describe('SurveyResult routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .send({
          answer: 'any_answer',
        })
        .expect(403);
    });

    test('Should return 403 on save survey result with invalid accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .set('x-access-token', 'invalid_token')
        .send({
          answer: 'any_answer',
        })
        .expect(403);
    });

    test('Should return 200 on save survey result with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      const { insertedId } = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image_url',
        }, {
          answer: 'Answer 2',
        }],
        date: new Date(),
      });
      await request(app)
        .put(`/api/surveys/${insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1',
        })
        .expect(200);
    });
  });
});
