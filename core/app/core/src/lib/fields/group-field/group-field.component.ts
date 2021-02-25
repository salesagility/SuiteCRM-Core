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

import {Component} from '@angular/core';
import {Field} from 'common';
import {BaseFieldComponent} from '../base/base-field.component';
import {DataTypeFormatter} from '../../services/formatters/data-type.formatter.service';
import {GroupFieldRegistry} from '../group-field.registry';

@Component({
    selector: 'scrm-group-field',
    templateUrl: './group-field.component.html',
    styleUrls: []
})
export class GroupFieldComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter, protected registry: GroupFieldRegistry) {
        super(typeFormatter);
    }

    getComponentType(type: string): any {
        let module = (this.record && this.record.module) || 'default';
        return this.registry.get(module, type, this.mode);
    }

    /**
     * Get the group fields from the record
     *
     * @returns {object} Field[]
     */
    getFields(): Field[] {
        const fields: Field[] = [];

        this.field.definition.layout.forEach(name => {
            fields.push(this.record.fields[name]);
        });

        return fields;
    }

    getModule(): string {
        if (!this.record) {
            return null;
        }

        return this.record.module;
    }

    /**
     * Get flex direction to be used
     *
     * @returns {string} direction
     */
    getDirection(): string {
        let direction = 'flex-column';

        if (this.field.definition.display === 'inline') {
            direction = 'flex-row';
        }

        return direction;
    }

    /**
     * Check if is configured
     *
     * @returns {boolean} is configured
     */
    isConfigured(): boolean {
        return this.hasDisplay() && this.hasLayout() && this.hasGroupFields();
    }

    showLabel(fieldName: string): boolean {
        const definition = this.field.definition || null;
        const showLabel = definition.showLabel || null;

        if (!definition || !showLabel) {
            return false;
        }

        const showLabelOptions = definition.showLabel[this.mode] || null;

        // showLabel > viewMode not defined || defined without any values e.g. edit:
        if(!showLabelOptions || typeof(showLabelOptions) === 'undefined'){
            return false;
        }

        return (showLabelOptions.includes('*') || showLabelOptions.includes(fieldName));
    }

    /**
     * Check if groupFields are configured
     *
     * @returns {boolean} has groupFields
     */
    protected hasGroupFields(): boolean {
        return !!(this.field.definition.groupFields && Object.keys(this.field.definition.groupFields).length);
    }

    /**
     * Check if layout is configured
     *
     * @returns {boolean} has layout
     */
    protected hasLayout(): boolean {
        return !!(this.field.definition.layout && this.field.definition.layout.length);
    }

    /**
     * Check if display is configured
     *
     * @returns {boolean} has display
     */
    protected hasDisplay(): boolean {
        return !!this.field.definition.display;
    }
}
