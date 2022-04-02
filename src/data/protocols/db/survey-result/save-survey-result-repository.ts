import { SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';

export interface SaveSurveyResultRepository {
  save(survey: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
