import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DatetimeParserFormatter} from '@fields/base/datetime/datetime-parser-formatter.service';
import {DatetimeAdapter} from '@fields/base/datetime/datetime-adapter.service';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-datetime-edit',
    templateUrl: './datetime.component.html',
    styleUrls: [],
    providers: [
        {provide: NgbDateAdapter, useClass: DatetimeAdapter},
        {provide: NgbDateParserFormatter, useClass: DatetimeParserFormatter}
    ]
})
export class DateTimeEditFieldComponent extends BaseDateTimeComponent implements OnInit, OnDestroy {

    date: {
        year: number;
        month: number;
    };

    constructor(
        protected formatter: DatetimeFormatter,
        protected dateAdapter: NgbDateAdapter<string>,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(formatter, typeFormatter);
    }

    ngOnInit(): void {
        this.subscribeValueChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
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
