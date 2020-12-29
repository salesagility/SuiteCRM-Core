import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTime} from 'luxon';
import {Formatter} from '@services/formatters/formatter.model';

export interface DatetimeFormats {
    date: string;
    time: string;
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

    toUserFormat(dateString: string): string {
        return formatDate(dateString, this.getUserFormat(), this.locale);
    }

    toInternalFormat(dateString: string): string {
        if (!dateString) {
            return '';
        }

        const dateTime = this.toDateTime(dateString);

        if (!dateTime.isValid) {
            return '';
        }

        return formatDate(dateTime.toJSDate(), this.getInternalFormat(), this.locale);
    }

    toDateTime(datetimeString: string): DateTime {
        if (!datetimeString) {
            return DateTime.invalid('empty');
        }

        let dateTime = this.fromUserFormat(datetimeString);

        if (!dateTime.isValid) {
            dateTime = this.fromInternalFormat(datetimeString);
        }

        return dateTime;
    }

    userFormatToStruct(datetime: string): NgbDateStruct {
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
        };
    }

    fromUserFormat(datetime: string): DateTime {

        datetime = datetime.replace('a', 'A');
        datetime = datetime.replace('p', 'P');
        datetime = datetime.replace('m', 'M');

        let format = this.getUserFormat();

        format = format.replace('aaaaa\'m\'', 'a');

        return DateTime.fromFormat(datetime, format);
    }

    fromInternalFormat(datetime: string): DateTime {

        const format = this.getInternalFormat();

        return DateTime.fromFormat(datetime, format);
    }

    validateUserFormat(dateString: string): boolean {
        const dateTime = this.fromUserFormat(dateString);
        return !dateTime.isValid;
    }
}
