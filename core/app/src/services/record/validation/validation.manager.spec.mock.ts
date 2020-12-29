import {ValidationManager} from '@services/record/validation/validation.manager';
import {RequiredValidator} from '@services/record/validation/validators/required.validator';

export const validationManagerMock = new ValidationManager(new RequiredValidator());
