import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import {DatetimeFormatter} from '@services/datetime/datetime-formatter.service';

@Injectable()
export class DatetimeAdapter extends NgbDateAdapter<string> {

    readonly DELIMITER = '-';

    constructor(protected formatter: DatetimeFormatter) {
        super();
    }

    fromModel(value: string | null): NgbDateStruct | null {
        if (!value) {
            return null;
        }

        const splitDateTime = value.split(' ');

        if (!splitDateTime) {
            return null;
        }

        const date = splitDateTime[0].split(this.DELIMITER);
        return {
            day: parseInt(date[2], 10),
            month: parseInt(date[1], 10),
            year: parseInt(date[0], 10)
        };
    }

    toModel(date: NgbDateStruct | null): string | null {

        if (!date) {
            return null;
        }

        const dateString = [date.year, date.month, date.day].join(this.DELIMITER);

        return this.formatter.toInternalFormat(dateString);
    }
}
