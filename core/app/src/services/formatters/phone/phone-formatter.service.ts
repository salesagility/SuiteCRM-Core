import {Injectable} from '@angular/core';
import {Formatter} from '@services/formatters/formatter.model';
import {FormControlUtils} from '@services/record/field/form-control.utils';

@Injectable({
    providedIn: 'root'
})
export class PhoneFormatter implements Formatter {

    constructor(protected formUtils: FormControlUtils) {
    }

    toUserFormat(value: string): string {
        return value;
    }

    toInternalFormat(value: string): string {
        return value;
    }

    getUserFormatPattern(): string {
        return '^([\\+]?|00)((([(]{0,1}\\s*[0-9]{1,4}\\s*[)]{0,1})\\s*)*|([\\-\\s\\./0-9])*)+$';
    }

    validateUserFormat(inputValue: any): boolean {

        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const regex = new RegExp(this.getUserFormatPattern());
        return !regex.test(trimmedInputValue);

    }

}
