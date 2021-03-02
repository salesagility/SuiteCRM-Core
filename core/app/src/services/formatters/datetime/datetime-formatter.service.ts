import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTime} from 'luxon';
import {FormatOptions, Formatter} from '@services/formatters/formatter.model';
import {FormControlUtils} from '@services/record/field/form-control.utils';

export interface DatetimeFormats {
    date: string;
    time: string;
}

export interface DateTimeStruct extends NgbDateStruct, NgbTimeStruct {
}

@Injectable({
    providedIn: 'root'
})
export class DatetimeFormatter implements Formatter {

    format$: Observable<DatetimeFormats> = combineLatest([
        this.preferences.userPreferences$
    ]).pipe(
        map(() => {

            const date = this.getDateFormat();
            const time = this.getTimeFormat();

            return {date, time};
        })
    );

    constructor(
        protected preferences: UserPreferenceStore,
        protected formUtils: FormControlUtils,
        @Inject(LOCALE_ID) public locale: string
    ) {

    }

    getDateFormat(): string {
        const dateFormatPreference = this.preferences.getUserPreference('date_format');

        if (dateFormatPreference) {
            return dateFormatPreference;
        }

        return this.getInternalTimeFormat();
    }

    getTimeFormat(): string {

        const timeFormatPreference = this.preferences.getUserPreference('time_format');

        if (timeFormatPreference) {
            let format: string = timeFormatPreference;

            if (format.includes('aaaaaa')) {
                format = format.replace('aaaaaa', 'aaaaa\'m\'');
            }

            return format;
        }

        return this.getInternalTimeFormat();
    }

    getDateTimeFormat(): string {
        const dateFormat = this.getDateFormat();
        const timeFormat = this.getTimeFormat();
        return dateFormat + ' ' + timeFormat;
    }

    getInternalDateFormat(): string {
        return 'yyyy-MM-dd';
    }

    getInternalTimeFormat(): string {
        return 'HH:mm:ss';
    }

    getInternalDateTimeFormat(): string {
        const dateFormat = this.getInternalDateFormat();
        const timeFormat = this.getInternalTimeFormat();
        return dateFormat + ' ' + timeFormat;
    }

    getInternalFormat(): string {
        return this.getInternalDateTimeFormat();
    }

    getUserFormat(): string {
        return this.getDateTimeFormat();
    }

    toUserFormat(dateString: string, options?: FormatOptions): string {
        const fromFormat = (options && options.fromFormat) || '';
        return dateString ? this.formatDateTime(dateString, this.getUserFormat(), fromFormat) : '';
    }

    toInternalFormat(dateString: string, options?: FormatOptions): string {
        const fromFormat = (options && options.fromFormat) || '';
        return dateString ? this.formatDateTime(dateString, this.getInternalFormat(), fromFormat) : '';
    }

    formatDateTime(dateString: string, format: string, fromFormat = ''): string {
        const dateTime = this.toDateTime(dateString, fromFormat);

        if (!dateTime.isValid) {
            return dateString;
        }
        return formatDate(dateTime.toJSDate(), format, this.locale);
    }

    toDateTime(datetimeString: string, fromFormat = ''): DateTime {
        if (!datetimeString) {
            return DateTime.invalid('empty');
        }

        if (fromFormat) {
            return DateTime.fromFormat(datetimeString, fromFormat);
        }

        let dateTime = this.fromUserFormat(datetimeString);

        if (!dateTime.isValid) {
            dateTime = this.fromInternalFormat(datetimeString);
        }

        return dateTime;
    }

    userDateTimeFormatToStruct(datetime: string): DateTimeStruct {
        const dateStruct = this.userDateFormatToStruct(datetime);
        const timeStruct = this.userTimeFormatToStruct(datetime);
        return {...dateStruct, ...timeStruct};
    }

    userDateFormatToStruct(datetime: string): NgbDateStruct {
        if (!datetime) {
            return null;
        }

        const dateTime = this.toDateTime(datetime);

        if (!dateTime.isValid) {
            return null;
        }

        return {
            day: dateTime.day,
            month: dateTime.month,
            year: dateTime.year
        } as NgbDateStruct;
    }

    userTimeFormatToStruct(datetime: string): NgbTimeStruct {
        if (!datetime) {
            return null;
        }

        const dateTime = this.toDateTime(datetime);

        if (!dateTime.isValid) {
            return null;
        }

        return {
            hour: dateTime.hour,
            minute: dateTime.minute,
            second: dateTime.second
        } as NgbTimeStruct;
    }

    fromUserFormat(datetime: string): DateTime {
        datetime = datetime.toString();
        datetime = datetime.replace('a', 'A');
        datetime = datetime.replace('p', 'P');
        datetime = datetime.replace('m', 'M');

        let format = this.getUserFormat();
        format = format.replace('aaaaa\'m\'', 'a');
        return DateTime.fromFormat(datetime, format);
    }

    fromInternalFormat(datetime: string): DateTime {
        const format = this.getInternalFormat();
        return DateTime.fromFormat(datetime.toString(), format);
    }

    validateUserFormat(inputValue: any): boolean {

        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const dateTime = this.fromUserFormat(trimmedInputValue);
        return !dateTime.isValid;
    }

}
