import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {formatCurrency, formatNumber} from '@angular/common';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {FormatOptions, Formatter} from '@services/formatters/formatter.model';
import {isVoid} from '@app-common/utils/value-utils';

export interface CurrencyFormat {
    iso4217: string;
    name: string;
    symbol: string;
}

@Injectable({
    providedIn: 'root'
})
export class CurrencyFormatter implements Formatter {

    constructor(
        protected preferences: UserPreferenceStore,
        protected numberFormatter: NumberFormatter,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    toUserFormat(value: string, options: FormatOptions = null): string {

        if (isVoid(value) || value === '') {
            return '';
        }

        const symbol = (options && options.symbol) || this.getSymbol();
        const code = (options && options.code) || this.getCode();
        let digits = null;
        if (options && options.digits !== null && isFinite(options.digits)) {
            digits = options.digits;
        }

        const digitsInfo = this.getDigitsInfo(digits);
        let formatted: string;

        if (options && options.mode === 'edit') {
            formatted = formatNumber(Number(value), this.locale, digitsInfo);
            return this.replaceSeparators(formatted);
        }

        formatted = formatCurrency(Number(value), this.locale, symbol, code, digitsInfo);
        return this.replaceSeparators(formatted);
    }

    toInternalFormat(value: string): string {
        if (!value) {
            return '';
        }

        const transformed = value.replace(this.getSymbol(), '');
        return this.numberFormatter.toInternalFormat(transformed);
    }

    getCurrencyFormat(): CurrencyFormat {
        const currencyFormat = this.preferences.getUserPreference('currency');

        if (currencyFormat) {
            return currencyFormat;
        }

        return this.getDefaultFormat();
    }

    getDefaultFormat(): CurrencyFormat {

        return {
            iso4217: 'USD',
            name: 'US Dollars',
            symbol: '$'
        };
    }

    getCode(): string {
        return this.getCurrencyFormat().iso4217;
    }

    getSymbol(): string {
        return this.getCurrencyFormat().symbol;
    }

    getDigits(): number {
        const digits = this.preferences.getUserPreference('default_currency_significant_digits');

        if (digits) {
            return digits;
        }

        return 2;
    }

    getDigitsInfo(definedDigits?: number): string {
        let digitInfo = '1.2-2';
        let digits = this.getDigits();

        if (definedDigits !== null && isFinite(definedDigits)) {
            digits = definedDigits;
        }

        if (digits !== null && isFinite(digits)) {
            if (digits < 1) {
                digitInfo = '1.0-0';
            } else {
                digitInfo = `1.${digits}-${digits}`;
            }
        }

        return digitInfo;
    }

    replaceSeparators(transformed: string): string {
        return this.numberFormatter.replaceSeparators(transformed);
    }
}
