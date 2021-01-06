import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {FormControlUtils} from '@services/record/field/form-control.utils';

export const datetimeFormatterMock = new DatetimeFormatter(
    userPreferenceStoreMock,
    new FormControlUtils(),
    'en-US'
);
