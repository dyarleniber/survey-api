import {
  LoadSurveyById, LoadSurveyResult, Controller, HttpRequest, HttpResponse,
} from './load-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId);
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}