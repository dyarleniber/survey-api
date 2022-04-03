import MockDate from 'mockdate';
import { DbLoadSurveyById } from '@/data/use-cases/survey/load-survey-by-id/db-load-survey-by-id';
import {
  LoadSurveyByIdRepository,
} from '@/data/use-cases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { mockSurveyModel } from '@/tests/domain/mocks';
import { mockLoadSurveyByIdRepository } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helper';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe('DbLoadSurveyById Use case', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw an error if LoadSurveyByIdRepository throws an error', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError);
    const promise = sut.loadById('any_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const survey = await sut.loadById('any_id');
    expect(survey).toBeNull();
  });

  test('Should return a survey on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById('any_id');
    expect(survey).toEqual(mockSurveyModel());
  });
});
