import {Input} from '@angular/core';
import {FieldComponentInterface} from './field.interface';
import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';
import {Subscription} from 'rxjs';
import {isVoid} from '@app-common/utils/value-utils';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

export class BaseFieldComponent implements FieldComponentInterface {
    @Input() mode: string;
    @Input() field: Field;
    @Input() record: Record;
    @Input() klass: { [klass: string]: any } = null;
    protected subs: Subscription[] = [];

    constructor(protected typeFormatter: DataTypeFormatter) {
    }

    protected subscribeValueChanges(): void {
        if (this.field && this.field.formControl) {
            this.subs.push(this.field.formControl.valueChanges.subscribe(value => {

                if (!isVoid(value)){
                    value = value.trim();
                }
                else{
                    value = '';
                }

                if (this.typeFormatter && this.field.type) {
                    value = this.typeFormatter.toInternalFormat(this.field.type, value);
                }

                this.setFieldValue(value);
            }));
        }
    }

    protected setFieldValue(newValue): void {
        this.field.value = newValue;
    }

    protected unsubscribeAll(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
