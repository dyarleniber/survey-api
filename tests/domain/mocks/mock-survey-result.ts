import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50,
  }, {
    answer: 'other_answer',
    image: 'any_image',
    count: 1,
    percent: 50,
  }],
  date: new Date(),
});

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(_survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }
  return new SaveSurveyResultStub();
};
