import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-varchar-filter',
    templateUrl: './filter.component.html',
    styleUrls: []
})
export class VarcharFilterFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    ngOnInit(): void {
        let current = '';

        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            current = this.field.criteria.values[0];
        }

        this.field.value = current;
        const formattedValue = this.typeFormatter.toUserFormat(this.field.type, current, {mode: 'edit'});
        this.field.formControl.setValue(formattedValue);

        this.subscribeValueChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    protected setFieldValue(newValue): void {
        this.field.value = newValue;
        this.field.criteria.operator = '=';
        this.field.criteria.values = [newValue];
    }
}
