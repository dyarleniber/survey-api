import { LoginController } from '@/presentation/controllers/login/login/login-controller';
import {
  Authentication,
  HttpRequest,
  Validation,
} from '@/presentation/controllers/login/login/login-controller-protocols';
import { MissingParamError, ServerError } from '@/presentation/errors';
import {
  badRequest, ok, serverError, unauthorized,
} from '@/presentation/helpers/http/http-helpers';
import { mockAuthentication, mockAuthenticationModel } from '@/tests/domain/mocks';
import { mockValidation } from '@/tests/presentation/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(mockRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockAuthenticationModel()));
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockImplementation(() => new MissingParamError('any_field'));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });

  test('Should return 500 if Validation throws an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
});
