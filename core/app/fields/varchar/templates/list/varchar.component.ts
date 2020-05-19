import {Component,} from '@angular/core';
import {FieldComponentInterface} from '../../../field.component';
import {FieldMetadata} from '../../../field.model';

@Component({
    selector: 'scrm-varchar-list',
    templateUrl: './varchar.component.html',
    styleUrls: []
})
export class VarcharListFieldsComponent implements FieldComponentInterface {
    type: string;
    value: string;
    metadata?: FieldMetadata;

    data: any = {};
    link = '#';
    class = 'text';

    constructor() {
    }
}
