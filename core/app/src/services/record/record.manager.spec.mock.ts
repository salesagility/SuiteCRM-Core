import {RecordManager} from '@services/record/record.manager';
import {fieldManagerMock} from '@services/record/field/field.manager.spec.mock';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

export const recordManagerMock = new RecordManager(fieldManagerMock, languageStoreMock);
