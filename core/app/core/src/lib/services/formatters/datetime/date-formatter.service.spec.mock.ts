import {userPreferenceStoreMock} from '../../../store/user-preference/user-preference.store.spec.mock';
import {DateFormatter} from './date-formatter.service';
import {FormControlUtils} from '../../record/field/form-control.utils';

export const dateFormatterMock = new DateFormatter(
    userPreferenceStoreMock,
    new FormControlUtils(),
    'en-US'
);
