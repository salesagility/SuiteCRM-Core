import {DataTypeFormatter} from './data-type.formatter.service';
import {currencyFormatterMock} from './currency/currency-formatter.service.spec.mock';
import {numberFormatterMock} from './number/number-formatter.spec.mock';
import {datetimeFormatterMock} from './datetime/datetime-formatter.service.spec.mock';
import {phoneFormatterMock} from './phone/phone-formatter.spec.mock';
import {dateFormatterMock} from './datetime/date-formatter.service.spec.mock';

export const dataTypeFormatterMock = new DataTypeFormatter(
    currencyFormatterMock,
    numberFormatterMock,
    dateFormatterMock,
    datetimeFormatterMock,
    phoneFormatterMock
);
