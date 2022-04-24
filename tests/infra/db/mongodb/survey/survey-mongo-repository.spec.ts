import { Collection } from 'mongodb';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { mockAddSurveyParams } from '@/tests/domain/mocks';

let surveyCollection: Collection;

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

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
      const sut = makeSut();
      await surveyCollection.insertMany([
        mockAddSurveyParams(),
        mockAddSurveyParams(),
      ]);
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[1].id).toBeTruthy();
    });

    test('Should load an empty list if loadAll returns empty', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();
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
