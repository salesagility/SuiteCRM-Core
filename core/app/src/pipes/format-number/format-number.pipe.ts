import {Inject, LOCALE_ID, Pipe} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';

@Pipe({
    name: 'formatNumber'
})
export class FormatNumberPipe extends DecimalPipe {

    constructor(
        protected formatter: NumberFormatter,
        @Inject(LOCALE_ID) public locale: string
    ) {
        super(locale);
    }

    transform(value: any): string | null {

        return this.formatter.toUserFormat(value);
    }
}
