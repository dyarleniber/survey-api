import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory';
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { mockEmailValidator } from '@/tests/validation/mocks';

jest.mock('@/validation/validators/validation-composite');

describe('Login Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const emailValidatorStub = mockEmailValidator();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', emailValidatorStub),
    ]);
  });
});
