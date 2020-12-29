import {Component,} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-date-detail',
    templateUrl: './date.component.html',
    styleUrls: []
})
export class DateDetailFieldComponent extends BaseDateTimeComponent {

    constructor(
        protected formatter: DatetimeFormatter,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(formatter, typeFormatter);
    }
}
