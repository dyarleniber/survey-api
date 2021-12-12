import { ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators';

export const makeAddSurveyValidation = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldValidation('question'),
  new RequiredFieldValidation('answers'),
]);
