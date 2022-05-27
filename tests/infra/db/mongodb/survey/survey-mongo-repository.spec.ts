import { Collection, ObjectId } from 'mongodb';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

const makeAccount = async (): Promise<ObjectId> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());
  return insertedId;
};

const makeSurveyResult = async (
  surveyId: ObjectId,
  accountId: ObjectId,
  answer: string,
): Promise<ObjectId> => {
  const { insertedId } = await surveyResultCollection.insertOne({
    surveyId,
    accountId,
    answer,
    date: new Date(),
  });
  return insertedId;
};

describe('Survey Mongo Repository', () => {
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

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const count = await surveyCollection.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on loadAll success', async () => {
      const accountId = await makeAccount();
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()];
      const { insertedIds } = await surveyCollection.insertMany(addSurveyModels);
      const survey = await surveyCollection.findOne({ _id: insertedIds[0] });
      await makeSurveyResult(insertedIds[0], accountId, survey?.answers[0]?.answer);
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId.toHexString());
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].id).toBeTruthy();
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('Should load an empty list if loadAll returns empty', async () => {
      const accountId = await makeAccount();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId.toHexString());
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should load a survey on loadById success', async () => {
      const sut = makeSut();
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams());
      const survey = await sut.loadById(insertedId.toHexString());
      expect(survey).toBeTruthy();
      expect(survey?.id).toBeTruthy();
      expect(survey?.question).toBe('any_question');
    });
  });
});
