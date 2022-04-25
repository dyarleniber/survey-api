import { Controller } from '@/presentation/protocols';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/survey/load-survey-by-id/db-load-survey-by-id-factory';
import { makeDbLoadSurveyResult } from '@/main/factories/use-cases/survey-result/load-survey-result/db-load-survey-result-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyById = makeDbLoadSurveyById();
  const loadSurveyResult = makeDbLoadSurveyResult();
  const loadSurveyResultController = new LoadSurveyResultController(
    loadSurveyById,
    loadSurveyResult,
  );
  return makeLogControllerDecorator(loadSurveyResultController);
};
