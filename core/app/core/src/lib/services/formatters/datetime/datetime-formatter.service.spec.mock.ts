import {DatetimeFormatter} from './datetime-formatter.service';
import {userPreferenceStoreMock} from '../../../store/user-preference/user-preference.store.spec.mock';
import {FormControlUtils} from '../../record/field/form-control.utils';

export const datetimeFormatterMock = new DatetimeFormatter(
    userPreferenceStoreMock,
    new FormControlUtils(),
    'en-US'
);
