import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(_survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
