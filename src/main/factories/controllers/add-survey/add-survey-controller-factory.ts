import { Controller } from '../../../../presentation/protocols';
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { makeDbAddSurvey } from '../../use-cases/add-survey/db-add-survey-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeAddSurveyController = (): Controller => {
  const validation = makeAddSurveyValidation();
  const addSurvey = makeDbAddSurvey();
  const addSurveyController = new AddSurveyController(validation, addSurvey);
  return makeLogControllerDecorator(addSurveyController);
};
