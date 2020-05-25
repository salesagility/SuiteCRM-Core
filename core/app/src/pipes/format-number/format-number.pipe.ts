import {Pipe} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
    name: 'formatNumber'
})
export class FormatNumberPipe extends DecimalPipe {

    transform(value: any, decimalsSeparator?: string, groupSeparator?: string): string | null {
        let transformed = super.transform(value);
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
