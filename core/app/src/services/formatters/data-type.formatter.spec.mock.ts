import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {currencyFormatterMock} from '@services/formatters/currency/currency-formatter.service.spec.mock';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';

export const dataTypeFormatterMock = new DataTypeFormatter(
    currencyFormatterMock,
    numberFormatterMock,
    datetimeFormatterMock,
);
