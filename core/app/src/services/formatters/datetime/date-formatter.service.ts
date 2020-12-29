import {Injectable} from '@angular/core';
import {formatDate} from '@angular/common';
import {DateTime} from 'luxon';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';

@Injectable({
    providedIn: 'root'
})
export class DateFormatter extends DatetimeFormatter {

    toInternalFormat(dateString: string): string {
        if (!dateString) {
            return '';
        }

        const dateTime = DateTime.fromFormat(dateString, this.getInternalDateFormat());

        if (dateTime.isValid) {
            return '';
        }

        return formatDate(dateString, this.getDateFormat(), this.locale);
    }

    validateUserFormat(dateString: string): boolean {
        const dateTime = DateTime.fromFormat(dateString, this.getInternalDateFormat());
        return !dateTime.isValid;
    }

    toUserFormat(dateString: string): string {
        return formatDate(dateString, this.getDateFormat(), this.locale);
    }
}
