import { AddSurvey } from '../../../../../domain/use-cases/add-survey';
import { DbAddSurvey } from '../../../../../data/use-cases/add-survey/db-add-survey';
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
