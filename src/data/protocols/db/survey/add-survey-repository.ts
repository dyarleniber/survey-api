import { AddSurveyParams } from '@/domain/use-cases/survey/add-survey';

export interface AddSurveyRepository {
  add(survey: AddSurveyParams): Promise<void>;
}
