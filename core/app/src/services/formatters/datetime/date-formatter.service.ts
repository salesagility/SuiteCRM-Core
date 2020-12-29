import {Injectable} from '@angular/core';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';

@Injectable({
    providedIn: 'root'
})
export class DateFormatter extends DatetimeFormatter {

    getInternalFormat(): string {
        return this.getInternalDateFormat();
    }

    getUserFormat(): string {
        return this.getDateFormat();
    }
}
