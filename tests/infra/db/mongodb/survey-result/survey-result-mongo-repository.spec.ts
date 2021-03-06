import { Collection, ObjectId } from 'mongodb';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
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
      await sut.save({
        surveyId: surveyId.toHexString(),
        accountId: accountId.toHexString(),
        answer: 'any_answer',
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId,
      });
      expect(surveyResult).toBeTruthy();
    });

    test('Should update survey result if it is not new', async () => {
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const sut = makeSut();
      await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date(),
      });
      await sut.save({
        surveyId: surveyId.toHexString(),
        accountId: accountId.toHexString(),
        answer: 'other_answer',
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection
        .find({
          surveyId,
          accountId,
        })
        .toArray();
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    test('Should load a survey result on loadBySurveyId success', async () => {
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const accountId2 = await makeAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId,
          accountId,
          answer: 'any_answer',
          date: new Date(),
        },
        {
          surveyId,
          accountId: accountId2,
          answer: 'any_answer',
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(
        surveyId.toHexString(),
        accountId.toHexString(),
      );
      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId).toEqual(surveyId.toHexString());
      expect(surveyResult?.answers[0].answer).toBe('any_answer');
      expect(surveyResult?.answers[0].count).toBe(2);
      expect(surveyResult?.answers[0].percent).toBe(100);
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult?.answers[1].count).toBe(0);
      expect(surveyResult?.answers[1].percent).toBe(0);
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    test('Should load a survey result on loadBySurveyId success 2', async () => {
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const accountId2 = await makeAccount();
      const accountId3 = await makeAccount();
      const sut = makeSut();
      await surveyResultCollection.insertMany([
        {
          surveyId,
          accountId,
          answer: 'any_answer',
          date: new Date(),
        },
        {
          surveyId,
          accountId: accountId2,
          answer: 'other_answer',
          date: new Date(),
        },
        {
          surveyId,
          accountId: accountId3,
          answer: 'other_answer',
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(
        surveyId.toHexString(),
        accountId2.toHexString(),
      );
      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId).toEqual(surveyId.toHexString());
      expect(surveyResult?.answers[0].answer).toBe('other_answer');
      expect(surveyResult?.answers[0].count).toBe(2);
      expect(surveyResult?.answers[0].percent).toBe(67);
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult?.answers[1].count).toBe(1);
      expect(surveyResult?.answers[1].percent).toBe(33);
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false);
    });
  });
});
