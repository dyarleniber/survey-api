import { ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols';

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockImplementation(() => new Error('any_error'));
    const error = sut.validate({});
    expect(error).toEqual(new Error('any_error'));
  });

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockImplementation(() => new Error('any_error'));
    jest.spyOn(validationStubs[1], 'validate').mockImplementation(() => new Error('other_error'));
    const error = sut.validate({});
    expect(error).toEqual(new Error('any_error'));
  });

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });

  test('Should run through all its validations and calls the validate method on them if no validation fails', () => {
    const { sut, validationStubs } = makeSut();
    const validateSpy1 = jest.spyOn(validationStubs[0], 'validate');
    const validateSpy2 = jest.spyOn(validationStubs[1], 'validate');
    const input = {};
    sut.validate(input);
    expect(validateSpy1).toHaveBeenCalledWith(input);
    expect(validateSpy2).toHaveBeenCalledWith(input);
  });
});
