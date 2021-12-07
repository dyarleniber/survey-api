import { RequiredFieldValidation } from '../../../../src/presentation/helpers/validators/required-field-validation';
import { MissingParamError } from '../../../../src/presentation/errors';

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation('any_field');

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).toEqual(new MissingParamError('any_field'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toBeFalsy();
  });
});