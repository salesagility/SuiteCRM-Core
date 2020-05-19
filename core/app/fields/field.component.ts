import {Component, Input} from '@angular/core';

import {FieldMetadata} from './field.model';
import {viewFieldsMap} from './field.manifest';

export interface FieldComponentInterface {
    type: string;
    value: string;
    metadata?: FieldMetadata;
}

@Component({
    selector: 'scrm-field',
    template: `
        <ndc-dynamic
                [ndcDynamicComponent]="map[type + '.' + view]"
                [ndcDynamicInputs]="{
                    'type': type,
                    'value': value,
                    'metadata': metadata
                }"
        ></ndc-dynamic>
    `,
    styleUrls: []
})
export class FieldComponent {
    map = viewFieldsMap;
    id: string;

    @Input('view') view: string;
    @Input('type') type: string;
    @Input('value') value: string;
    @Input('metadata') metadata?: FieldMetadata;
    @Input('row') row?: any;

    constructor() {
    }
}
