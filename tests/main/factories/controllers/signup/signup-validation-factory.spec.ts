import { makeSignUpValidation } from '../../../../../src/main/factories/controllers/signup/signup-validation-factory';
import {
  ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation,
} from '../../../../../src/presentation/helpers/validators';
import { EmailValidator } from '../../../../../src/presentation/protocols';

jest.mock('../../../../../src/presentation/helpers/validators/validation-composite');

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
