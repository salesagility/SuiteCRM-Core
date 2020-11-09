import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';

@Injectable()
export class DatetimeParserFormatter extends NgbDateParserFormatter {

    constructor(protected formatter: DatetimeFormatter) {
        super();
    }

    parse(value: string): NgbDateStruct | null {
        if (!value) {
            return null;
        }

        return this.formatter.fromUserDate(value);
    }

    format(date: NgbDateStruct | null): string {
        if (!date) {
            return null;
        }

        const dateString = [date.year, date.month, date.day].join('-');

        return this.formatter.toUserFormat(dateString);
    }
}
