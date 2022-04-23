import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import {
  AddAccount,
  Authentication,
  HttpRequest,
  Validation,
} from '@/presentation/controllers/login/signup/signup-controller-protocols';
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors';
import {
  badRequest, forbidden, ok, serverError,
} from '@/presentation/helpers/http/http-helpers';
import { mockAddAccount, mockAuthentication } from '@/tests/domain/mocks';
import { mockValidation } from '@/tests/presentation/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new SignUpController(addAccountStub, authenticationStub, validationStub);
  return {
    sut,
    addAccountStub,
    authenticationStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    await sut.handle(mockRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if AddAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
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

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
});
