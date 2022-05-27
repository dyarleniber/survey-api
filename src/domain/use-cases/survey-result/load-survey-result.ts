import { SurveyResultModel } from '@/domain/models/survey-result';

export interface LoadSurveyResult {
  load(survey: string, accountId: string): Promise<SurveyResultModel>;
}
