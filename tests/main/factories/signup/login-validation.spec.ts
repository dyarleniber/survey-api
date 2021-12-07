import { makeLoginValidation } from '../../../../src/main/factories/login/login-validation';
import { ValidationComposite } from '../../../../src/presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../../src/presentation/helpers/validators/required-field-validation';
import { EmailValidation } from '../../../../src/presentation/helpers/validators/email-validation';
import { EmailValidator } from '../../../../src/presentation/protocols';

jest.mock('../../../../src/presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('Login Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const emailValidatorStub = makeEmailValidator();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', emailValidatorStub),
    ]);
  });
});
