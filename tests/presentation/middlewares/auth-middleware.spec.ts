import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import {
  AccountModel,
  HttpRequest,
  LoadAccountByToken,
} from '@/presentation/middlewares/auth-middleware-protocols';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { AccessDeniedError } from '@/presentation/errors';
import { mockAccountModel } from '@/tests/domain/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(_accessToken: string, _role?: string): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenStub();
};

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut('any_role');
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 500 if LoadAccountByToken throws an error', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
  });
});
