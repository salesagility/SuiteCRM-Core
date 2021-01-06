import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {formatNumber} from '@angular/common';
import {Formatter} from '@services/formatters/formatter.model';
import {isVoid} from '@app-common/utils/value-utils';
import {FormControlUtils} from '@services/record/field/form-control.utils';

@Injectable({
    providedIn: 'root'
})
export class NumberFormatter implements Formatter {

    constructor(
        protected preferences: UserPreferenceStore,
        protected formUtils: FormControlUtils,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    toUserFormat(value: string): string {

        if (isVoid(value) || value === '') {
            return '';
        }

        const formatted = formatNumber(Number(value), this.locale);
        return this.replaceSeparators(formatted);
    }

    toInternalFormat(value: string): string {

        if (!value) {
            return value;
        }

        const decimalSymbol = this.getDecimalsSymbol() || '.';
        const groupSymbol = this.getGroupSymbol() || ',';

        let decimalSymbolRegex = new RegExp(decimalSymbol, 'g');
        if (decimalSymbol === '.') {
            decimalSymbolRegex = new RegExp('\\.', 'g');
        }

        let groupSymbolRegex = new RegExp(groupSymbol, 'g');
        if (groupSymbol === '.') {
            groupSymbolRegex = new RegExp('\\.', 'g');
        }

        value = value.replace(groupSymbolRegex, 'group_separator');
        value = value.replace(decimalSymbolRegex, 'decimal_separator');


        value = value.replace(/decimal_separator/g, '.');
        value = value.replace(/group_separator/g, '');

        return value;
    }

    getFloatUserFormatPattern(): string {

        const group = this.getGroupSymbol();
        const decimals = this.getDecimalsSymbol();

        let pattern = '^(';
        pattern += '(\\d{1,3}(\\' + group + '\\d{3})*(\\' + decimals + '\\d+)?)|';
        pattern += '\\d*|';
        pattern += '(\\d+(\\' + decimals + '\\d+)?)|';
        pattern += '(\\d+(\\.\\d+)?)';
        pattern += ')$';
        return pattern;
    }

    getIntUserFormatPattern(): string {

        const group = this.getGroupSymbol();

        let pattern = '^(';
        pattern += '(\\d{1,3}(\\' + group + '\\d{3})*)|';
        pattern += '\\d*';
        pattern += ')$';
        return pattern;
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

        transformed = transformed.replace(/,/g, 'group_separator');
        transformed = transformed.replace(/\./g, 'decimal_separator');

        const decimalSymbol = this.getDecimalsSymbol() || '.';
        const groupSymbol = this.getGroupSymbol() || ',';

        transformed = transformed.replace(/decimal_separator/g, decimalSymbol);
        transformed = transformed.replace(/group_separator/g, groupSymbol);

        return transformed;
    }

    validateIntUserFormat(inputValue: any): boolean {

        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const regex = new RegExp(this.getIntUserFormatPattern());
        if (regex.test(trimmedInputValue)) {
            return false;
        }
    }

    validateFloatUserFormat(inputValue: any): boolean {

        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const regex = new RegExp(this.getFloatUserFormatPattern());
        return !regex.test(trimmedInputValue);

    }

}
