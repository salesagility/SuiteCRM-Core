import {languageStoreMock} from '../../store/language/language.store.spec.mock';
import {DynamicLabelService} from './dynamic-label.service';
import {dataTypeFormatterMock} from '../formatters/data-type.formatter.spec.mock';

export const dynamicLabelsMock = new DynamicLabelService(dataTypeFormatterMock, languageStoreMock);
