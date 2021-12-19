import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory';
import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter';

export default (router: Router): void => {
  const adminAuth = expressMiddlewareAdapter(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, expressRouteAdapter(makeAddSurveyController()));
};
