import { SurveyModel } from '@/domain/models/survey';

export type AddSurveyModel = Omit<SurveyModel, 'id'>;

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>;
}
