import {Component, Input} from '@angular/core';
import {viewFieldsMap} from './field.manifest';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {Record} from '@app-common/record/record.model';
import {Field} from '@app-common/record/field.model';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';

@Component({
    selector: 'scrm-field',
    templateUrl: './field.component.html',
    styleUrls: []
})
export class FieldComponent {
    @Input('mode') mode: string;
    @Input('type') type: string;
    @Input('field') field: Field;
    @Input('record') record: Record = null;
    @Input('klass') klass: { [key: string]: any } = null;

    map = viewFieldsMap;

    constructor(protected navigation: ModuleNavigation, private moduleNameMapper: ModuleNameMapper) {
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
        if (this.mode !== 'detail' && this.mode !== 'list') {
            return false;
        }

        if (!this.field || !this.record) {
            return false;
        }

        if (this.type === 'relate') {
            return true;
        }

        return !!(this.field.metadata && this.field.metadata.link);
    }

    getLink(): string {
        if (this.type === 'relate') {
            return this.getRelateLink;
        }

        return this.navigation.getRecordRouterLink(this.record.module, this.record.id);
    }

    get getRelateLink(): string {
        if (this.field.definition.id_name && this.field.definition.module) {
            const moduleName = this.moduleNameMapper.toFrontend(this.field.definition.module);

            return this.navigation.getRecordRouterLink(
                moduleName,
                this.record.attributes[this.field.definition.id_name]
            );
        }

        return '';
    }
}
