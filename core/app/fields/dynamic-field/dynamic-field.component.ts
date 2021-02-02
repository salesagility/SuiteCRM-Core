import {Component, Input, OnInit, Type} from '@angular/core';
import {Record} from '@app-common/record/record.model';
import {StringMap} from '@app-common/types/StringMap';
import {Field} from '@app-common/record/field.model';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {Router} from '@angular/router';

@Component({
    selector: 'scrm-dynamic-field',
    templateUrl: './dynamic-field.component.html',
    styleUrls: []
})
export class DynamicFieldComponent implements OnInit {

    @Input('mode') mode: string;
    @Input('type') type: string;
    @Input('field') field: Field;
    @Input('record') record: Record = null;
    @Input('klass') klass: { [key: string]: any } = null;
    @Input('componentType') componentType: Type<any>;

    constructor(
        protected navigation: ModuleNavigation,
        protected moduleNameMapper: ModuleNameMapper,
        protected router: Router
    ) {
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

    ngOnInit(): void {
    }

    isLink(): boolean {
        if (this.mode !== 'detail' && this.mode !== 'list') {
            return false;
        }

        if (!this.field || !this.record) {
            return false;
        }

        if (this.type === 'relate' && this.field.metadata && this.field.metadata.link !== false) {
            return true;
        }

        return !!(this.field.metadata && this.field.metadata.link);
    }

    hasOnClick(): boolean {
        return !!(this.field && this.field.metadata && this.field.metadata.onClick);
    }

    isEdit(): boolean {
        return this.mode === 'edit' || this.mode === 'filter';
    }

    getLink(): string {
        if (this.type === 'relate') {
            return this.getRelateLink;
        }

        return this.navigation.getRecordRouterLink(this.record.module, this.record.id);
    }

    getMessageContext(item: any, record: Record): StringMap {
        const context = item && item.message && item.message.context || {};
        context.module = (record && record.module) || '';

        return context;
    }

    getMessageLabelKey(item: any): string {
        return (item && item.message && item.message.labelKey) || '';
    }

    onClick(): boolean {
        if (this.field.metadata.onClick) {
            this.field.metadata.onClick(this.field, this.record);
            return;
        }

        this.router.navigateByUrl(this.getLink()).then();
        return false;
    }

}
