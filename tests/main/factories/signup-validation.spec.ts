import { makeSignUpValidation } from '../../../src/main/factories/signup-validation';
import { ValidationComposite } from '../../../src/presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../src/presentation/helpers/validators/required-field-validation';
import { CompareFieldsValidation } from '../../../src/presentation/helpers/validators/compare-fields-validation';

jest.mock('../../../src/presentation/helpers/validators/validation-composite');

describe('SignUp Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    ]);
  });
});
