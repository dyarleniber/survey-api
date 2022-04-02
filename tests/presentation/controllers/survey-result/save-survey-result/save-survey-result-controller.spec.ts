import MockDate from 'mockdate';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import {
  LoadSurveyById,
  SaveSurveyResult,
  SurveyModel,
  SurveyResultModel,
  SaveSurveyResultParams,
  HttpRequest,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers';

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(_id: string): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(_survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultStub();
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws an error', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementation(async () => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id',
      },
      body: {
        answer: 'wrong_answer',
      },
    });
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date(),
    });
  });

  test('Should return 500 if SaveSurveyResult throws an error', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementation(async () => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()));
  });
});
