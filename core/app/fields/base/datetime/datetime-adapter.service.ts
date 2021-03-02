import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import {DatetimeFormatter, DateTimeStruct} from '@services/formatters/datetime/datetime-formatter.service';
import {padObjectValues} from '@app-common/utils/object-utils';


@Injectable()
export class DatetimeAdapter extends NgbDateAdapter<string> {

    readonly DELIMITER = '-';

    constructor(
        protected formatter: DatetimeFormatter
    ) {
        super();
    }

    fromModel(value: string | null): DateTimeStruct | null {
        if (!value) {
            return null;
        }

        return this.formatter.userDateTimeFormatToStruct(value);
    }

    toModel(date: DateTimeStruct | null): string | null {
        if (!date) {
            return null;
        }
        date = padObjectValues(date);
        const dateString = [date.month, date.day, date.year].join(this.DELIMITER);
        const timeString = ['00', '00'].join('.');
        const dateTimeString = dateString + ' ' + timeString;
        return this.formatter.toUserFormat(dateTimeString);
    }
}
