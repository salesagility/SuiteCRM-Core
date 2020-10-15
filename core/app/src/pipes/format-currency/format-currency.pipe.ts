import {Pipe} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({
    name: 'formatCurrency'
})
export class FormatCurrencyPipe extends CurrencyPipe {

    transform(
        value: any,
        currencyCode?: string,
        currencySymbol?: string,
        decimalsSeparator?: string,
        groupSeparator?: string,
        digits?: number
    ): string | null {

        let digitInfo = '1.2-2';

        if (isFinite(digits)) {
            if (digits < 1) {
                digitInfo = '1.0-0';
            } else {
                digitInfo = `1.${digits}-${digits}`;
            }
        }

        let transformed = super.transform(value, currencyCode, currencySymbol, digitInfo);
        if (!transformed) {
            return transformed;
        }

        transformed = transformed.replace(',', 'group_separator');
        transformed = transformed.replace('.', 'decimal_separator');
        const decimalSymbol = decimalsSeparator || '.';
        const groupSymbol = groupSeparator || ',';

        transformed = transformed.replace('decimal_separator', decimalSymbol);
        transformed = transformed.replace('group_separator', groupSymbol);

        return transformed;
    }
}
