import { SurveyResultModel } from '@/domain/models/survey-result';

export interface LoadSurveyResult {
  load(survey: string): Promise<SurveyResultModel>;
}
