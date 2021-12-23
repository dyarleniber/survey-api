import { makeAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey/add-survey-validation-factory';
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';

jest.mock('../../../../../../src/validation/validators/validation-composite');

describe('AddSurvey Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('question'),
      new RequiredFieldValidation('answers'),
    ]);
  });
});
