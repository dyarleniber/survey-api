import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../../validation/validators';
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter();
  return new ValidationComposite([
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('email', emailValidator),
  ]);
};
