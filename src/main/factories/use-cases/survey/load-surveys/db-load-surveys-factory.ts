import { LoadSurveys } from '@/domain/use-cases/load-surveys';
import { DbLoadSurveys } from '@/data/use-cases/load-surveys/db-load-surveys';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
