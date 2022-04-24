import { SurveyModel } from '@/domain/models/survey';
import { AddSurvey, AddSurveyParams } from '@/domain/use-cases/survey/add-survey';
import { LoadSurveys } from '@/domain/use-cases/survey/load-surveys';
import { LoadSurveyById } from '@/domain/use-cases/survey/load-survey-by-id';

export const mockSurveyModel = (): SurveyModel => ({
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
});

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
];

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
  }, {
    answer: 'other_answer',
  }],
  date: new Date(),
});

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(_survey: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }
  return new LoadSurveysStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(_id: string): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }
  return new LoadSurveyByIdStub();
};
