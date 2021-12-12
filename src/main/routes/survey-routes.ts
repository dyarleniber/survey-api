import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory';

export default (router: Router): void => {
  router.post('/surveys', expressRouteAdapter(makeAddSurveyController()));
};
