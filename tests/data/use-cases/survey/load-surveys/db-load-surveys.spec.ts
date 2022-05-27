import MockDate from 'mockdate';
import { DbLoadSurveys } from '@/data/use-cases/survey/load-surveys/db-load-surveys';
import {
  LoadSurveysRepository,
} from '@/data/use-cases/survey/load-surveys/db-load-surveys-protocols';
import { mockSurveyModels } from '@/tests/domain/mocks';
import { mockLoadSurveysRepository } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helper';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurveys Use case', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load('any_account_id');
    expect(loadAllSpy).toHaveBeenCalledWith('any_account_id');
  });

  test('Should throw an error if LoadSurveysRepository throws an error', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError);
    const promise = sut.load('any_account_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return empty if LoadSurveysRepository returns empty', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(Promise.resolve([]));
    const surveys = await sut.load('any_account_id');
    expect(surveys).toEqual([]);
  });

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load('any_account_id');
    expect(surveys).toEqual(mockSurveyModels());
  });
});
