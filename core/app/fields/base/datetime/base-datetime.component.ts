import {BaseFieldComponent} from '../base-field.component';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';

export class BaseDateTimeComponent extends BaseFieldComponent {

    vm$ = this.formatter.format$;

    constructor(
        protected formatter: DatetimeFormatter,
    ) {
        super();
    }

    getDateFormat(): string {
        return this.formatter.getDateFormat();
    }

    getDateTimeFormat(): string {
        return this.formatter.getDateTimeFormat();
    }
}
