import MockDate from 'mockdate';
import { DbSaveSurveyResult } from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result';
import {
  SurveyResultModel,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
} from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { mockSurveyResultModel, mockSaveSurveyResultParams } from '@/tests/domain/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(_survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

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
    const surveyData = mockSaveSurveyResultParams();
    await sut.save(surveyData);
    expect(saveSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw an error if the SaveSurveyResultRepository throws an error', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
