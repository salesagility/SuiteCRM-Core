import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import{DateFormatter} from '@services/formatters/datetime/date-formatter.service';

@Injectable()
export class DateParserFormatter extends NgbDateParserFormatter {

    constructor(protected formatter: DateFormatter) {
        super();
    }

    parse(value: string): NgbDateStruct | null {
        if (!value) {
            return null;
        }
        return this.formatter.userDateFormatToStruct(value);
    }

    format(date: NgbDateStruct | null): string {
        if (!date) {
            return null;
        }
        const dateString = [date.year, date.month, date.day].join('-');
        return this.formatter.toUserFormat(dateString, {fromFormat: 'yyyy-M-d'});
    }
}
