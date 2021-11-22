/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, HostBinding, Input, OnInit, Type} from '@angular/core';
import {Field, Record, StringMap} from 'common';
import {Router} from '@angular/router';
import {ModuleNameMapper} from '../../services/navigation/module-name-mapper/module-name-mapper.service';
import {ModuleNavigation} from '../../services/navigation/module-navigation/module-navigation.service';

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
    @Input('parent') parent: Record = null;
    @Input('klass') klass: { [key: string]: any } = null;
    @Input('componentType') componentType: Type<any>;

    @HostBinding('class') class = 'dynamic-field';

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
        this.setHostClass();
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

    public setHostClass() {
        const classes = [];
        classes.push('dynamic-field');

        if (this.mode) {
            classes.push('dynamic-field-mode-' + this.mode)
        }

        if (this.type) {
            classes.push('dynamic-field-type-' + this.type)
        }

        if (this.field && this.field.name) {
            classes.push('dynamic-field-name-' + this.field.name)
        }

        this.class = classes.join(' ');
    }

}
