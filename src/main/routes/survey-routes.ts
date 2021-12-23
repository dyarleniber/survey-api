import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { auth, adminAuth } from '../middlewares';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, expressRouteAdapter(makeAddSurveyController()));
  router.get('/surveys', auth, expressRouteAdapter(makeLoadSurveysController()));
};
