import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express-route-adapter';
import { makeSignUpController } from '../factories/controllers/login/signup/signup-controller-factory';
import { makeLoginController } from '../factories/controllers/login/login/login-controller-factory';

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()));
  router.post('/login', expressRouteAdapter(makeLoginController()));
};
