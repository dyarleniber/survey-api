import MockDate from 'mockdate';
import { DbLoadSurveyResult } from '@/data/use-cases/survey-result/load-survey-result/db-load-survey-result';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from '@/data/use-cases/survey-result/load-survey-result/db-load-survey-result-protocols';
import { mockSurveyResultModel, mockEmptySurveyResultModel } from '@/tests/domain/mocks';
import { mockLoadSurveyResultRepository, mockLoadSurveyByIdRepository } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helper';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  };
};

describe('DbLoadSurveyResult Use Case', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should throw an error if the LoadSurveyResultRepository throws an error', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null));
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.load('any_survey_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should throw an error if the LoadSurveyResultRepository throws an error', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(() => Promise.resolve(null));
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return an empty survey result if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null));
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockEmptySurveyResultModel());
  });

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
