import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import{DateFormatter} from '@services/formatters/datetime/date-formatter.service';

@Injectable()
export class DateAdapter extends NgbDateAdapter<string> {

    constructor(
        protected formatter: DateFormatter,
    ) {
        super();
    }

    fromModel(value: string | null): NgbDateStruct | null {
        if (!value) {
            return null;
        }
        return this.formatter.userDateFormatToStruct(value);
    }

    toModel(date: NgbDateStruct | null): string | null {
        if (!date) {
            return null;
        }
        const dateString = [date.year, date.month, date.day].join('-');
        return this.formatter.toUserFormat(dateString, {fromFormat: 'yyyy-M-d'});
    }
}
