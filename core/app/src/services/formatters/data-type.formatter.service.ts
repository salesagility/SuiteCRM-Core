import {Injectable} from '@angular/core';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {FormatOptions, Formatter} from '@services/formatters/formatter.model';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {PhoneFormatter} from '@services/formatters/phone/phone-formatter.service';

export interface TypeFormatterMap {
    [key: string]: Formatter;
}

@Injectable({
    providedIn: 'root'
})
export class DataTypeFormatter {

    map: TypeFormatterMap = {};

    constructor(
        protected currencyFormatter: CurrencyFormatter,
        protected numberFormatter: NumberFormatter,
        protected dateFormatter: DateFormatter,
        protected datetimeFormatter: DatetimeFormatter,
        protected phoneFormatter: PhoneFormatter,
    ) {
        this.map.int = numberFormatter;
        this.map.float = numberFormatter;
        this.map.date = dateFormatter;
        this.map.datetime = datetimeFormatter;
        this.map.currency = currencyFormatter;
        this.map.phone = phoneFormatter;
    }

    toUserFormat(dataType: string, value: string, options?: FormatOptions): string {

        if (!dataType) {
            return value;
        }

        const formatter = this.map[dataType];
        if (!formatter) {
            return value;
        }

        return formatter.toUserFormat(value, options);
    }

    toInternalFormat(dataType: string, value: string): string {

        if (!dataType) {
            return value;
        }

        const formatter = this.map[dataType];
        if (!formatter) {
            return value;
        }

        return formatter.toInternalFormat(value);
    }
}
