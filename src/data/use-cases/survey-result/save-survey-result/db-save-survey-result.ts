import {
  SaveSurveyResult, SurveyResultModel, SaveSurveyResultParams, SaveSurveyResultRepository,
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(survey);
  }
}
