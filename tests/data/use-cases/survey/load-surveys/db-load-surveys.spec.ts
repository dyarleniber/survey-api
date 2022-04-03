import MockDate from 'mockdate';
import { DbLoadSurveys } from '@/data/use-cases/survey/load-surveys/db-load-surveys';
import {
  LoadSurveysRepository,
  SurveyModel,
} from '@/data/use-cases/survey/load-surveys/db-load-surveys-protocols';
import { mockSurveyModels } from '@/tests/domain/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return mockSurveyModels();
    }
  }

  return new LoadSurveysRepositoryStub();
};

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
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

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test('Should throw an error if LoadSurveysRepository throws an error', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError);
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test('Should return empty if LoadSurveysRepository returns empty', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(Promise.resolve([]));
    const surveys = await sut.load();
    expect(surveys).toEqual([]);
  });

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(mockSurveyModels());
  });
});
