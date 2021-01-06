import {Injectable} from '@angular/core';
import {Formatter} from '@services/formatters/formatter.model';
import {FormControlUtils} from '@services/record/field/form-control.utils';

@Injectable({
    providedIn: 'root'
})
export class EmailFormatter implements Formatter {

    constructor(protected formUtils: FormControlUtils) {
    }

    toUserFormat(value: string): string {
        return value;
    }

    toInternalFormat(value: string): string {

        const pattern = this.getUserFormatPattern();

        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
            return '';
        }

        return value;
    }

    getUserFormatPattern(): RegExp {
        // eslint-disable-next-line max-len
        return /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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
