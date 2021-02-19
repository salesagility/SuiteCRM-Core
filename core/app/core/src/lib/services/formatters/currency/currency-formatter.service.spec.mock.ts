import {userPreferenceStoreMock} from '../../../store/user-preference/user-preference.store.spec.mock';
import {numberFormatterMock} from '../number/number-formatter.spec.mock';
import {CurrencyFormatter} from './currency-formatter.service';

export const currencyFormatterMock = new CurrencyFormatter(
    userPreferenceStoreMock,
    numberFormatterMock,
    'en-US'
);
