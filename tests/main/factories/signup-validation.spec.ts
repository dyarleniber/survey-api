import { makeSignUpValidation } from '../../../src/main/factories/signup-validation';
import { ValidationComposite } from '../../../src/presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../src/presentation/helpers/validators/required-field-validation';
import { CompareFieldsValidation } from '../../../src/presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../../src/presentation/helpers/validators/email-validation';
import { EmailValidator } from '../../../src/presentation/protocols';

jest.mock('../../../src/presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUp Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const emailValidatorStub = makeEmailValidator();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', emailValidatorStub),
    ]);
  });
});
