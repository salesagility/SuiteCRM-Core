import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';

@Component({
    selector: 'scrm-varchar-filter',
    templateUrl: './filter.component.html',
    styleUrls: []
})
export class VarcharFilterFieldComponent extends BaseFieldComponent {

    get value(): string {
        let current = '';

        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            current = this.field.criteria.values[0];
        }

        return current;
    }

    set value(newValue: string) {
        this.field.value = newValue;
        this.field.criteria.operator = '=';
        this.field.criteria.values = [newValue];
    }
}
