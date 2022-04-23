import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
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
