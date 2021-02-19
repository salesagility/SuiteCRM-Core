import {userPreferenceStoreMock} from '../../../store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '../../../services/formatters/number/number-formatter.service';
import {FormControlUtils} from '../../../services/record/field/form-control.utils';

export const numberFormatterMock = new NumberFormatter(
    userPreferenceStoreMock,
    new FormControlUtils(),
    'en-US'
);
