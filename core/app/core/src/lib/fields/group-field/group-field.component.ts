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
import {Field, FieldDefinition, ViewMode} from 'common';
import {BaseFieldComponent} from '../base/base-field.component';
import {FieldLogicManager} from '../field-logic/field-logic.manager';
import {DataTypeFormatter} from '../../services/formatters/data-type.formatter.service';
import {StandardFieldRegistry} from '../standard-field.registry';

@Component({
    selector: 'scrm-group-field',
    templateUrl: './group-field.component.html',
    styleUrls: []
})
export class GroupFieldComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter, protected registry: StandardFieldRegistry, protected logic: FieldLogicManager) {
        super(typeFormatter, logic);
    }

    getComponentType(type: string, definition: FieldDefinition): any {
        let module = (this.record && this.record.module) || 'default';

        const displayType = (definition && definition.displayType) || '';

        return this.registry.getDisplayType(module, type, displayType, this.mode);
    }

    /**
     * Get the group fields from the record
     *
     * @returns {object} Field[]
     */
    getFields(): Field[] {
        const fields: Field[] = [];

        this.field.definition.layout.forEach(name => {
            if (!this.record.fields[name] || this.record.fields[name].display === 'none'){
                return;
            }

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
        if (!showLabelOptions || typeof (showLabelOptions) === 'undefined') {
            return false;
        }

        return (showLabelOptions.includes('*') || showLabelOptions.includes(fieldName));
    }

    isModeEnabled(mode: string, groupField: Field) {
        const modes = groupField.definition.modes;
        if (!modes || modes.length < 1) {
            return true;
        }

        return modes.includes(mode as ViewMode);
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
