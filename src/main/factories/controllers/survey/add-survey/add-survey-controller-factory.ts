import { Controller } from '@/presentation/protocols';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { makeDbAddSurvey } from '@/main/factories/use-cases/survey/add-survey/db-add-survey-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): Controller => {
  const validation = makeAddSurveyValidation();
  const addSurvey = makeDbAddSurvey();
  const addSurveyController = new AddSurveyController(validation, addSurvey);
  return makeLogControllerDecorator(addSurveyController);
};
