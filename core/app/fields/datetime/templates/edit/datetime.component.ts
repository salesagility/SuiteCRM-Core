import {Component} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {
    NgbDateAdapter,
    NgbDateParserFormatter,
    NgbInputDatepicker,
    NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import {DatetimeParserFormatter} from '@fields/base/datetime/datetime-parser-formatter.service';
import {DatetimeAdapter} from '@fields/base/datetime/datetime-adapter.service';
import {DatetimeFormatter} from '@services/datetime/datetime-formatter.service';
import {ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-datetime-edit',
    templateUrl: './datetime.component.html',
    styleUrls: [],
    providers: [
        {provide: NgbDateAdapter, useClass: DatetimeAdapter},
        {provide: NgbDateParserFormatter, useClass: DatetimeParserFormatter}
    ]
})
export class DateTimeEditFieldComponent extends BaseDateTimeComponent {

    date: {
        year: number;
        month: number;
    };

    constructor(
        protected formatter: DatetimeFormatter,
        protected dateAdapter: NgbDateAdapter<string>
    ) {
        super(formatter);
    }

    get dateModel(): string {
        return this.field.value;
    }

    set dateModel(newValue: string) {
        if (!newValue) {
            this.field.value = '';
            return;
        }
        this.field.value = newValue;
    }

    getOpenButton(datepicker: NgbInputDatepicker): ButtonInterface {
        return {
            klass: 'record-action-button float-right',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick: () => datepicker.toggle(),
            icon: 'calendar'
        };
    }
}
