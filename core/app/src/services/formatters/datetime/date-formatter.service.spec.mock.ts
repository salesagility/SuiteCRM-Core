import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {FormControlUtils} from '@services/record/field/form-control.utils';

export const dateFormatterMock = new DateFormatter(
    userPreferenceStoreMock,
    new FormControlUtils(),
    'en-US'
);
