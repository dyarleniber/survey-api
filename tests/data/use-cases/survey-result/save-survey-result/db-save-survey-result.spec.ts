import MockDate from 'mockdate';
import { DbSaveSurveyResult } from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result';
import {
  SurveyResultModel,
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
} from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result-protocols';

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(_survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult Use Case', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyData = makeFakeSurveyResultData();
    await sut.save(surveyData);
    expect(saveSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw an error if the SaveSurveyResultRepository throws an error', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.save(makeFakeSurveyResultData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSurveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResult());
  });
});
