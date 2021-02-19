import {FieldManager} from './field.manager';
import {validationManagerMock} from '../validation/validation.manager.spec.mock';
import {dataTypeFormatterMock} from '../../formatters/data-type.formatter.spec.mock';

export const fieldManagerMock = new FieldManager(validationManagerMock, dataTypeFormatterMock);
