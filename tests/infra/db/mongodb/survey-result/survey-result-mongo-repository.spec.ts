import { Collection, ObjectId } from 'mongodb';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository();

const makeSurvey = async (): Promise<ObjectId> => {
  const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams());
  return insertedId;
};

const makeAccount = async (): Promise<ObjectId> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());
  return insertedId;
};

describe('SurveyResult Mongo Repository', () => {
  beforeAll(async (): Promise<void> => {
    await MongoHelper.connect(<string>process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    accountCollection = await MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await surveyResultCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('save()', () => {
    test('Should add a survey result if it is new', async () => {
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: surveyId.toHexString(),
        accountId: accountId.toHexString(),
        answer: 'any_answer',
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe('any_answer');
    });

    test('Should update survey result if it is not new', async () => {
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const sut = makeSut();
      const { insertedId } = await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date(),
      });
      const surveyResult = await sut.save({
        surveyId: surveyId.toHexString(),
        accountId: accountId.toHexString(),
        answer: 'other_answer',
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(insertedId.toHexString());
      expect(surveyResult.answer).toBe('other_answer');
    });
  });
});
