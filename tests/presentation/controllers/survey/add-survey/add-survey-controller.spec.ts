import { AddSurveyController } from '../../../../../src/presentation/controllers/survey/add-survey/add-survey-controller';
import { HttpRequest, Validation } from '../../../../../src/presentation/protocols';
import { MissingParamError, ServerError } from '../../../../../src/presentation/errors';
import { badRequest, serverError } from '../../../../../src/presentation/helpers/http/http-helpers';

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {},
});

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub,
  };
};

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockImplementation(() => new MissingParamError('any_field'));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });

  test('Should return 500 if Validation throws an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockImplementation(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
});
