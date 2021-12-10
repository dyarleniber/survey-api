import { makeLoginValidation } from '../../../../src/main/factories/login/login-validation-factory';
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../src/presentation/helpers/validators';
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
