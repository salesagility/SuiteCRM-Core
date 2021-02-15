import {Component, Input} from '@angular/core';
import {viewFieldsMap} from './field.manifest';
import {Record} from '@app-common/record/record.model';
import {Field} from '@app-common/record/field.model';

@Component({
    selector: 'scrm-field',
    templateUrl: './field.component.html',
    styleUrls: []
})
export class FieldComponent{
    @Input('mode') mode: string;
    @Input('type') type: string;
    @Input('field') field: Field;
    @Input('record') record: Record = null;
    @Input('klass') klass: { [key: string]: any } = null;

    map = viewFieldsMap;

    constructor() {

    }

    get componentMode(): string {
        let mode = this.mode;
        if(mode==='edit' && this.field.display && this.field.display==='readonly'){
            mode = 'detail';
        }

        return mode;
    }

    get componentType(): any {
        const mode = this.componentMode;
        const key = this.type + '.' + mode;

        if (this.map[key]) {
            return this.map[key];
        }

        const defaultKey = 'varchar' + '.' + mode;
        return this.map[defaultKey];
    }
}
