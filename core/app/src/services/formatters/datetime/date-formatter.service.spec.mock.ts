import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';

export const dateFormatterMock = new DateFormatter(
    userPreferenceStoreMock,
    'en-US'
);
