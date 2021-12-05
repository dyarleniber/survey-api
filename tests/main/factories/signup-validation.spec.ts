import { makeSignUpValidation } from '../../../src/main/factories/signup-validation';
import { Validation } from '../../../src/presentation/helpers/validators/validation';
import { ValidationComposite } from '../../../src/presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../src/presentation/helpers/validators/required-field-validation';

jest.mock('../../../src/presentation/helpers/validators/validation-composite');

describe('SignUp Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ].map((field) => new RequiredFieldValidation(field));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
