import {Pipe} from '@angular/core';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {FormatOptions} from '@services/formatters/formatter.model';

@Pipe({
    name: 'formatCurrency'
})
export class FormatCurrencyPipe {

    constructor(protected formatter: CurrencyFormatter) {
    }

    transform(value: any, options: FormatOptions = null): string | null {

        return this.formatter.toUserFormat(value, options);
    }
}
