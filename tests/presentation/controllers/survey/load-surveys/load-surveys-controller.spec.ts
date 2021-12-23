import MockDate from 'mockdate';
import { LoadSurveysController } from '../../../../../src/presentation/controllers/survey/load-surveys/load-surveys-controller';
import { LoadSurveys, SurveyModel } from '../../../../../src/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols';
import { ServerError } from '../../../../../src/presentation/errors';
import { serverError, ok, noContent } from '../../../../../src/presentation/helpers/http/http-helpers';

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
    didAnswer: false,
  },
];

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }
  return new LoadSurveysStub();
};

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test('Should return 500 if LoadSurveys throws an error', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementation(async () => { throw new Error(); });
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });
});
