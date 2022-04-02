import { SurveyResultModel } from '@/domain/models/survey-result';

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResult {
  save(survey: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
