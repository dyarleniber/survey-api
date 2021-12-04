import { LoginController } from '../../../../src/presentation/controllers/login/login-controller';
import { badRequest } from '../../../../src/presentation/helpers';
import { MissingParamError } from '../../../../src/presentation/errors';

const makeSut = (): LoginController => new LoginController();

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
