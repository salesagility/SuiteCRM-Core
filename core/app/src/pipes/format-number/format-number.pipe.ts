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

    transform(value: number | string, digitsInfo?: string, locale?: string): string | null;
    // eslint-disable-next-line no-dupe-class-members
    transform(value: null | undefined, digitsInfo?: string, locale?: string): null;
    // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
    transform(value: number | string | null | undefined, digitsInfo?: string, locale?: string): string | null {

        if (!value) {
            return null;
        }

        return this.formatter.toUserFormat('' + value);
    }
}
