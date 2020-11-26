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

    toUserFormat(dateString: string): string {
        return formatDate(dateString, this.getDateFormat(), this.locale);
    }

    toInternalFormat(dateString: string): string {
        return formatDate(dateString, this.getInternalDateFormat(), this.locale);
    }

    fromUserDate(datetime: string): NgbDateStruct {
        if (!datetime) {
            return null;
        }

        const dateTime = DateTime.fromFormat(datetime, this.getDateFormat());

        const date = dateTime.toISODate().split('-');
        return {
            day: parseInt(date[2], 10),
            month: parseInt(date[1], 10),
            year: parseInt(date[0], 10)
        };
    }
}
