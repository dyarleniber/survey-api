import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(_survey: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(_surveyId: string): Promise<SurveyResultModel | null> {
      return mockSurveyResultModel();
    }
  }
  return new LoadSurveyResultRepositoryStub();
};
