import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import {DatetimeFormatter, DateTimeStruct} from '@services/formatters/datetime/datetime-formatter.service';
import {padObjectValues} from '@app-common/utils/object-utils';

@Injectable()
export class DatetimeParserFormatter extends NgbDateParserFormatter {

    constructor(protected formatter: DatetimeFormatter) {
        super();
    }

    parse(value: string): DateTimeStruct | null {
        if (!value) {
            return null;
        }

        return this.formatter.userDateTimeFormatToStruct(value);
    }

    format(date: DateTimeStruct | null): string {
        if (!date) {
            return null;
        }
        date = padObjectValues(date);

        const dateString = [date.year, date.month, date.day].join('-');
        const timeString = ['00', '00', '00'].join(':');
        const dateTimeString = dateString+' '+timeString;

        return this.formatter.toUserFormat(dateTimeString);
    }
}
