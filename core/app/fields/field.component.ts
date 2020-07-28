import {Component, Input} from '@angular/core';

import {Field} from './field.model';
import {viewFieldsMap} from './field.manifest';
import {Record} from '@store/list-view/list-view.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'scrm-field',
    templateUrl: './field.component.html',
    styleUrls: []
})
export class FieldComponent {
    @Input('mode') mode: string;
    @Input('type') type: string;
    @Input('field') field: Field;
    @Input('record') record: Record;
    @Input('klass') klass: { [key: string]: any } = null;

    map = viewFieldsMap;

    constructor(protected navigation: ModuleNavigation) {
    }

    get componentType(): any {
        const key = this.type + '.' + this.mode;
        if (this.map[key]) {
            return this.map[key];
        }

        const defaultKey = 'varchar' + '.' + this.mode;
        return this.map[defaultKey];
    }

    isLink(): boolean {

        // Temp while relate fields aren't implemented
        if (this.type === 'relate') {
            return false;
        }

        if (this.mode !== 'detail' && this.mode !== 'list') {
            return false;
        }

        return !!(this.field && this.field.metadata && this.field.metadata.link && this.record);
    }

    getLink(): string {
        return this.navigation.getRecordRouterLink(this.record.module, this.record.id);
    }
}
