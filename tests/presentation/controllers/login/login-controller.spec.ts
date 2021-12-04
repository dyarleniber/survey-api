import { LoginController } from '../../../../src/presentation/controllers/login/login-controller';
import { EmailValidator, HttpRequest } from '../../../../src/presentation/controllers/login/login-protocols';
import { badRequest } from '../../../../src/presentation/helpers';
import { MissingParamError } from '../../../../src/presentation/errors';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
