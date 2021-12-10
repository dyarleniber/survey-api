import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/express/express-route-adapter';
import { makeSignUpController } from '../factories/signup/signup-factory';
import { makeLoginController } from '../factories/login/login-factory';

export default (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignUpController()));
  router.post('/login', expressRouteAdapter(makeLoginController()));
};
