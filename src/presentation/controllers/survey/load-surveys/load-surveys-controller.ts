import {
  Controller, HttpRequest, HttpResponse, LoadSurveys,
} from './load-surveys-controller-protocols';
import { serverError, ok, noContent } from '../../../helpers/http/http-helpers';

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys,
  ) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
