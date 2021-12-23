import { AddSurveyModel } from '@/domain/use-cases/add-survey';

export interface AddSurveyRepository {
  add(survey: AddSurveyModel): Promise<void>;
}
