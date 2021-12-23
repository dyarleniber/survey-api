import { Controller } from '../../../../../presentation/protocols';
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller';
import { makeDbLoadSurveys } from '../../../use-cases/survey/load-surveys/db-load-surveys-factory';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';

export const makeLoadSurveysController = (): Controller => {
  const loadSurveys = makeDbLoadSurveys();
  const loadSurveysController = new LoadSurveysController(loadSurveys);
  return makeLogControllerDecorator(loadSurveysController);
};
