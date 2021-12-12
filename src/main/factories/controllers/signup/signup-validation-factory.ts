import {
  ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation,
} from '../../../../presentation/helpers/validators';
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', emailValidator),
  ]);
};
