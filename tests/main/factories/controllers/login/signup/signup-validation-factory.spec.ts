import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { EmailValidator } from '@/validation/protocols';

jest.mock('@/validation/validators/validation-composite');

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
