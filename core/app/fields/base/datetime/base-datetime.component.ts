import {BaseFieldComponent} from '../base-field.component';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {Component} from '@angular/core';

@Component({template: ''})
export class BaseDateTimeComponent extends BaseFieldComponent {

    vm$ = this.formatter.format$;

    constructor(
        protected formatter: DatetimeFormatter,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(typeFormatter);
    }

    getDateFormat(): string {
        return this.formatter.getDateFormat();
    }

    getDateTimeFormat(): string {
        return this.formatter.getDateTimeFormat();
    }
}
