import { SurveyAnswerModel } from '@/domain/models/survey';

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>;
}
