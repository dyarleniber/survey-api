import {
  LoadSurveyResult, SurveyResultModel, LoadSurveyResultRepository, LoadSurveyByIdRepository,
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId);
      return ({
        surveyId: survey?.id!,
        question: survey?.question!,
        answers: survey?.answers!?.map((answer) => ({
          image: answer.image,
          answer: answer.answer,
          count: 0,
          percent: 0,
        })),
        date: survey?.date!,
      });
    }
    return surveyResult;
  }
}
