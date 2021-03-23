import {Component, OnDestroy, OnInit,} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DateAdapter} from '@fields/base/datetime/date/date-adapter.service';
import {DateParserFormatter} from '@fields/base/datetime/date/date-parser-formatter.service';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {isEmptyString} from '@app-common/utils/value-utils';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';


@Component({
    selector: 'scrm-date-filter',
    templateUrl: './date.component.html',
    styleUrls: [],
    providers: [
        {provide: NgbDateAdapter, useClass: DateAdapter},
        {provide: NgbDateParserFormatter, useClass: DateParserFormatter}
    ]
})
export class DateFilterFieldComponent extends BaseDateTimeComponent implements OnInit, OnDestroy {

    public dateModel: NgbDateStruct;

    constructor(
        protected formatter: DateFormatter,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(formatter, typeFormatter);
    }

    ngOnInit(): void {

        let current = '';
        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            current = this.field.criteria.values[0];
        }

        let formattedValue = null;
        if (!isEmptyString(current)) {
            current = current.trim();
            formattedValue = this.typeFormatter.toUserFormat(this.field.type, current, {mode: 'edit'});
        }
        this.field.value = current;
        this.field.formControl.setValue(formattedValue);
        this.field.formControl.markAsDirty();

        this.setModel(current);

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
            klass: 'btn btn-sm btn-outline-secondary m-0 border-0',
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

    protected setFieldValue(newValue): void {
        this.field.value = newValue;
        this.field.criteria.operator = '=';
        this.field.criteria.values = [newValue];
    }

}
