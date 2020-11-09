import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {formatNumber} from '@angular/common';
import {Formatter} from '@services/formatters/formatter.model';

@Injectable({
    providedIn: 'root'
})
export class NumberFormatter implements Formatter {

    constructor(
        protected preferences: UserPreferenceStore,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    toUserFormat(value: string): string {
        const formatted = formatNumber(Number(value), this.locale);
        return this.replaceSeparators(formatted);
    }

    getGroupSymbol(): string {

        const separator = this.preferences.getUserPreference('num_grp_sep');

        if (separator) {
            return separator;
        }


        return ',';
    }

    getDecimalsSymbol(): string {

        const separator = this.preferences.getUserPreference('dec_sep');

        if (separator) {
            return separator;
        }

        return '.';
    }

    replaceSeparators(transformed: string): string {
        if (!transformed) {
            return transformed;
        }

        transformed = transformed.replace(',', 'group_separator');
        transformed = transformed.replace('.', 'decimal_separator');

        const decimalSymbol = this.getDecimalsSymbol() || '.';
        const groupSymbol = this.getGroupSymbol() || ',';

        transformed = transformed.replace('decimal_separator', decimalSymbol);
        transformed = transformed.replace('group_separator', groupSymbol);

        return transformed;
    }
}
