import MockDate from 'mockdate';
import { DbAddSurvey } from '@/data/use-cases/survey/add-survey/db-add-survey';
import { AddSurveyParams, AddSurveyRepository } from '@/data/use-cases/survey/add-survey/db-add-survey-protocols';

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(_survey: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
  }],
  date: new Date(),
});

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Use Case', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw an error if the AddSurveyRepository throws an error', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.add(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});
