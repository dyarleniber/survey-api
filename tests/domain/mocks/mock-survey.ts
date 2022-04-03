import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyParams } from '@/domain/use-cases/survey/add-survey';

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
  }],
  date: new Date(),
});
