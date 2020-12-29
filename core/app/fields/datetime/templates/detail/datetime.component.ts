import {Component,} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-datetime-detail',
    templateUrl: './datetime.component.html',
    styleUrls: []
})
export class DateTimeDetailFieldComponent extends BaseDateTimeComponent {

    constructor(
        protected formatter: DatetimeFormatter,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(formatter, typeFormatter);
    }
}
