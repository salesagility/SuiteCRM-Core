import {RecordManager} from './record.manager';
import {fieldManagerMock} from './field/field.manager.spec.mock';
import {languageStoreMock} from '../../store/language/language.store.spec.mock';

export const recordManagerMock = new RecordManager(fieldManagerMock, languageStoreMock);
