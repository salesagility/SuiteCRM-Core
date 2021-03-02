import {Component, OnDestroy, OnInit,} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DateAdapter} from '@fields/base/datetime/date/date-adapter.service';
import {DateParserFormatter} from '@fields/base/datetime/date/date-parser-formatter.service';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';
import {isEmptyString} from '@app-common/utils/value-utils';


@Component({
    selector: 'scrm-date-edit',
    templateUrl: './date.component.html',
    styleUrls: [],
    providers: [
        {provide: NgbDateAdapter, useClass: DateAdapter},
        {provide: NgbDateParserFormatter, useClass: DateParserFormatter}
    ]
})
export class DateEditFieldComponent extends BaseDateTimeComponent implements OnInit, OnDestroy {

    public dateModel: NgbDateStruct;

    constructor(
        protected formatter: DateFormatter,
        protected dateAdapter: NgbDateAdapter<string>,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(formatter, typeFormatter);
    }

    ngOnInit(): void {

        // Note: handle NgbDatePicker default validation
        // Note: convert empty form value to null for the ngb date validator to pass it
        if (isEmptyString(this.field.value)) {
            this.field.formControl.setValue(null);
        }

        this.setModel(this.field.value);
        this.subscribeValueChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    setModel($event: any): void {
        this.dateModel = this.formatter.userDateFormatToStruct($event);
    }

    getOpenButton(datepicker: NgbInputDatepicker): ButtonInterface {
        return {
            klass: 'btn btn-sm btn-outline-secondary border-0',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick: () => {
                datepicker.toggle();
                datepicker.navigateTo(this.dateModel);
            },
            icon: 'calendar'
        };
    }

    getPlacement(): PlacementArray {
        return ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
    }

}
