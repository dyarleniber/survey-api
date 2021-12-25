import { Controller } from '@/presentation/protocols';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { makeLoadSurveyById } from '@/main/factories/use-cases/survey/load-survey-by-id/db-load-survey-by-id-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/use-cases/survey-result/save-survey-result/db-save-survey-result-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeSaveSurveyResultController = (): Controller => {
  const loadSurveyById = makeLoadSurveyById();
  const saveSurveyResult = makeDbSaveSurveyResult();
  const saveSurveyResultController = new SaveSurveyResultController(
    loadSurveyById,
    saveSurveyResult,
  );
  return makeLogControllerDecorator(saveSurveyResultController);
};
