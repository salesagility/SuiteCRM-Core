import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

export const currencyFormatterMock = new CurrencyFormatter(
    userPreferenceStoreMock,
    numberFormatterMock,
    'en-US'
);
