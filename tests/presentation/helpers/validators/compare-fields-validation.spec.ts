import { CompareFieldsValidation } from '../../../../src/presentation/helpers/validators';
import { InvalidParamError } from '../../../../src/presentation/errors';

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation('any_field', 'any_field_to_compare');

describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      any_field: 'any_value',
      any_field_to_compare: 'wrong_value',
    });
    expect(error).toEqual(new InvalidParamError('any_field_to_compare'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ any_field: 'any_value', any_field_to_compare: 'any_value' });
    expect(error).toBeFalsy();
  });
});
