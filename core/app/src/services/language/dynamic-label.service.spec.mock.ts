import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {DynamicLabelService} from '@services/language/dynamic-label.service';
import {dataTypeFormatterMock} from '@services/formatters/data-type.formatter.spec.mock';

export const dynamicLabelsMock = new DynamicLabelService(dataTypeFormatterMock, languageStoreMock);
