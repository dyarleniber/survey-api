import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { mockEmailValidator } from '@/tests/validation/mocks';

jest.mock('@/validation/validators/validation-composite');

describe('SignUp Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const emailValidatorStub = mockEmailValidator();
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
