import {Component, Input} from '@angular/core';

import {FieldMetadata} from './field.model';
import {viewFieldsMap} from './field.manifest';

@Component({
    selector: 'scrm-field',
    template: `
        <ndc-dynamic
                [ndcDynamicComponent]="map[type + '.' + mode]"
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

    @Input('mode') mode: string;
    @Input('type') type: string;
    @Input('value') value: string;
    @Input('metadata') metadata: FieldMetadata;
    @Input('row') row?: any;

    constructor() {
    }
}
