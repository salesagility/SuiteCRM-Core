import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';

export const numberFormatterMock = new NumberFormatter(
    userPreferenceStoreMock,
    'en-US'
);
