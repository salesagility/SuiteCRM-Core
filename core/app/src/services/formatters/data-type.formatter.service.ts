import {Injectable} from '@angular/core';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {FormatOptions, Formatter} from '@services/formatters/formatter.model';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

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
        protected dateFormatter: DatetimeFormatter,
    ) {
        this.map.int = numberFormatter;
        this.map.float = numberFormatter;
        this.map.date = dateFormatter;
        this.map.datetime = dateFormatter;
        this.map.currency = currencyFormatter;
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
}
