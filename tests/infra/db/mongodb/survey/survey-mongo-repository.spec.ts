import { Collection } from 'mongodb';
import { SurveyMongoRepository } from '../../../../../src/infra/db/mongodb/survey/survey-mongo-repository';
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper';

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

let surveyCollection: Collection;

describe('Survey Mongo Repository', () => {
  beforeAll(async (): Promise<void> => {
    await MongoHelper.connect(<string>process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  test('Should add a survey on add success', async () => {
    const sut = makeSut();
    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
    });
    const count = await surveyCollection.countDocuments();
    expect(count).toBe(1);
  });
});
