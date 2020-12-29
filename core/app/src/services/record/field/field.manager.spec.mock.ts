import {FieldManager} from '@services/record/field/field.manager';
import {validationManagerMock} from '@services/record/validation/validation.manager.spec.mock';

export const fieldManagerMock = new FieldManager(validationManagerMock);
