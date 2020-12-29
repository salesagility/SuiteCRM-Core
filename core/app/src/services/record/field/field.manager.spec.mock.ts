import {FieldManager} from '@services/record/field/field.manager';
import {validationManagerMock} from '@services/record/validation/validation.manager.spec.mock';
import {dataTypeFormatterMock} from '@services/formatters/data-type.formatter.spec.mock';

export const fieldManagerMock = new FieldManager(validationManagerMock, dataTypeFormatterMock);
