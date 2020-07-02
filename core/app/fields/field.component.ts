import {Component, Input} from '@angular/core';

import {Field} from './field.model';
import {viewFieldsMap} from './field.manifest';

@Component({
    selector: 'scrm-field',
    template: `
        <ndc-dynamic
                [ndcDynamicComponent]="componentType"
                [ndcDynamicInputs]="{
                    'field': field,
                    'klass': klass
                }"
        ></ndc-dynamic>
    `,
    styleUrls: []
})
export class FieldComponent {
    @Input('mode') mode: string;
    @Input('type') type: string;
    @Input('field') field: Field;
    @Input('klass') klass: { [key: string]: any } = null;

    map = viewFieldsMap;

    constructor() {
    }

    get componentType(): any {
        const key = this.type + '.' + this.mode;
        if (this.map[key]) {
            return this.map[key];
        }

        const defaultKey = 'varchar' + '.' + this.mode;
        return this.map[defaultKey];
    }
}
