import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { mockLogErrorRepository } from '@/tests/data/mocks';
import { mockController } from '@/tests/presentation/mocks/mock-controller';

const mockHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const mockHttpResponse = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

type SutTypes = {
  sut: Controller;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

const makeSut = (): SutTypes => {
  const controllerStub = mockController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return { sut, controllerStub, logErrorRepositoryStub };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(mockHttpRequest());
    expect(handleSpy).toHaveBeenCalledWith(mockHttpRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockHttpRequest());
    expect(httpResponse).toEqual(ok('any_body'));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(mockHttpResponse()));
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    await sut.handle(mockHttpRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
