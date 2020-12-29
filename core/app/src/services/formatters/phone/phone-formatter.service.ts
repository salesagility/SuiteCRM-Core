import {Injectable} from '@angular/core';
import {Formatter} from '@services/formatters/formatter.model';

@Injectable({
    providedIn: 'root'
})
export class PhoneFormatter implements Formatter {

    constructor() {
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

    getUserFormatPattern(): string {
        return '^([+]?|00)(([(]{0,1}[0-9]{1,4}[)]{0,1})\\s*)*|([-\\s\\./0-9])*$';
    }
}
