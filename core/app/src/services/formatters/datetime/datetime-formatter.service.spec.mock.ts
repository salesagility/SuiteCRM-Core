import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';

export const datetimeFormatterMock = new DatetimeFormatter(
    userPreferenceStoreMock,
    'en-US'
);
