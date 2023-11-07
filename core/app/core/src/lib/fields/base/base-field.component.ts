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

import { isEqual } from 'lodash-es';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AttributeDependency, deepClone, Field, FieldValue, isVoid, ObjectMap, Record, ViewMode } from 'common';
import {FieldComponentInterface} from './field.interface';
import {DataTypeFormatter} from '../../services/formatters/data-type.formatter.service';
import {FieldLogicManager} from '../field-logic/field-logic.manager';
import {FieldLogicDisplayManager} from '../field-logic-display/field-logic-display.manager';

@Component({template: ''})
export class BaseFieldComponent implements FieldComponentInterface, OnInit, OnDestroy {
    @Input() mode: string;
    @Input() field: Field;
    @Input() record: Record;
    @Input() parent: Record;
    @Input() klass: { [klass: string]: any } = null;
    dependentFields: ObjectMap = {};
    dependentAttributes: AttributeDependency[] = [];
    protected subs: Subscription[] = [];
    protected previousValue?: FieldValue = {
        value: '',
        valueList: [],
        valueObject: {},
    };

    constructor(
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager,
        protected logicDisplay: FieldLogicDisplayManager
    ) {
    }

    ngOnInit(): void {
        this.baseInit();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    protected baseInit(): void {
        this.initDependencyHandlers();
    }

    /**
     * Calculate and init dependency handlers
     */
    protected initDependencyHandlers(): void {
        if (!this.record) {
            return;
        }
        const fieldKeys = (this.record.fields && Object.keys(this.record.fields)) || [];
        if (fieldKeys.length > 1) {
            this.calculateDependentFields(fieldKeys);
            this.previousValue = deepClone({
                value: this.field.value,
                valueList: this.field.valueList,
                valueObject: this.field.valueObject,
                forceNotEqual: 'forceNotEqual',
            });

            if((this.dependentFields && Object.keys(this.dependentFields).length) || this.dependentAttributes.length) {
                Object.keys(this.dependentFields).forEach(fieldKey => {
                    const field = this.record.fields[fieldKey] || null;
                    if (!field) {
                        return;
                    }

                    const types = this.dependentFields[fieldKey].type ?? [];

                    if (types.includes('logic')) {
                        this.logic.runLogic(field, this.mode as ViewMode, this.record, 'onFieldInitialize');
                    }

                    if (types.includes('displayLogic')) {
                        this.logicDisplay.runAll(field, this.record, this.mode as ViewMode);
                    }
                });
            }

            if (
                this.field.valueChanges$
                && ((this.dependentFields && Object.keys(this.dependentFields).length) || this.dependentAttributes.length)
            ) {
                this.subs.push(this.field.valueChanges$.pipe(debounceTime(500)).subscribe((data) => {
                    Object.keys(this.dependentFields).forEach(fieldKey => {
                        const dependentField = this.dependentFields[fieldKey];
                        const field = this.record.fields[fieldKey] || null;
                        if (!field) {
                            return;
                        }

                        if (!isEqual(this.previousValue, data)) {
                            const types = dependentField.type ?? [];

                            if (types.includes('logic')) {
                                this.logic.runLogic(field, this.mode as ViewMode, this.record, 'onValueChange');
                            }

                            if (types.includes('displayLogic')) {
                                this.logicDisplay.runAll(field, this.record, this.mode as ViewMode);
                            }
                        }
                    });
                    this.previousValue = deepClone({
                        value: data.value,
                        valueList: data.valueList,
                        valueObject: data.valueObject,
                    });

                    this.dependentAttributes.forEach(dependency => {
                        const field = this.record.fields[dependency.field] || {} as Field;
                        const attribute = (field && field.attributes && field.attributes[dependency.attribute]) || null;

                        if (!attribute) {
                            return;
                        }

                        this.logic.runLogic(attribute, this.mode as ViewMode, this.record, 'onValueChange');
                    });

                }));
            }

        }
    }

    /**
     * Calculate dependent fields
     *
     * @param {string[]} fieldKeys Record field keys
     * @protected
     */
    protected calculateDependentFields(fieldKeys: string[]): void {
        fieldKeys.forEach(key => {

            if (this.field.source === 'field') {
                this.addFieldDependency(key, this.dependentFields, this.dependentAttributes);
                return;
            }

            if (this.field.source === 'attribute') {
                this.addAttributeDependency(key, this.dependentFields, this.dependentAttributes);
                return;
            }

        });
    }

    /**
     * Add field dependency
     *
     * @param {string} fieldKey Field key
     * @param {Array} dependentFields Dependent Fields
     * @param {object} dependentAttributes Dependent Attributes
     */
    protected addFieldDependency(fieldKey: string, dependentFields: ObjectMap, dependentAttributes: AttributeDependency[]): void {
        const field = this.record.fields[fieldKey];
        const name = this.field.name || this.field.definition.name || '';
        if (fieldKey === name || !field) {
            return;
        }

        if (field.fieldDependencies && this.isDependencyField(field.fieldDependencies)) {
            dependentFields[fieldKey] = field.fieldDependencies[name];
        }

        const attributeKeys = (field.attributes && Object.keys(field.attributes)) || [];

        attributeKeys.forEach(attributeKey => {

            const attribute = field.attributes[attributeKey];
            if (!attribute || !attribute.fieldDependencies || !attribute.fieldDependencies.length) {
                return;
            }

            if (this.isDependencyField(attribute.fieldDependencies)) {
                dependentAttributes.push({
                    field: fieldKey,
                    attribute: attributeKey,
                    types: dependentFields[name].types ?? []
                });
            }
        });
    }

    /**
     * Check if field is dependency
     *
     * @param {ObjectMap} dependencies Dependencies
     * @returns {boolean} field is dependency
     */
    protected isDependencyField(dependencies: ObjectMap): boolean {
        const name = this.field.name || this.field.definition.name || '';

        return !!(dependencies[name] ?? false);
    }

    /**
     * Add attribute dependency
     *
     * @param {string} fieldKey Field Key
     * @param {ObjectMap} dependentFields Dependent Fields
     * @param {AttributeDependency[]} dependentAttributes Dependent Attributes
     */
    protected addAttributeDependency(fieldKey: string, dependentFields: ObjectMap, dependentAttributes: AttributeDependency[]): void {
        const field = this.record.fields[fieldKey];
        const name = this.field.name || this.field.definition.name || '';
        if (fieldKey === name || !field) {
            return;
        }

        if (field.attributeDependencies && field.attributeDependencies.length && this.isDependencyAttribute(field.attributeDependencies)) {
            dependentFields[name] = field.fieldDependencies[name];
        }

        const attributeKeys = (field.attributes && Object.keys(field.attributes)) || [];

        attributeKeys.forEach(attributeKey => {

            const attribute = field.attributes[attributeKey];
            if (!attribute || !attribute.attributeDependencies || !attribute.attributeDependencies.length) {
                return;
            }

            if (this.isDependencyAttribute(attribute.attributeDependencies)) {
                dependentAttributes.push({
                    field: fieldKey,
                    attribute: attributeKey,
                    types: (dependentFields[name] ?? {}).types ?? [],
                });
            }
        });
    }

    /**
     * Check if attribute is dependency
     *
     * @param {object} attributeDependencies Attribute Dependencies
     * @returns {boolean} attribute is dependency
     */
    protected isDependencyAttribute(attributeDependencies: AttributeDependency[]): boolean {

        const parentKey = this.field.parentKey || '';
        const name = this.field.name || this.field.definition.name || '';

        return attributeDependencies.some(dependency => parentKey === dependency.field && name === dependency.attribute);
    }

    protected subscribeValueChanges(): void {
        if (this.field && this.field.formControl) {
            this.subs.push(this.field.formControl.valueChanges.subscribe(value => {

                if (!isVoid(value) && typeof value === 'string') {
                    value = value.trim();
                } else {
                    value = '';
                }

                if (this.typeFormatter && this.field.type) {
                    value = this.toInternalFormat(this.field.type, value);
                }

                this.setFieldValue(value);
            }));
        }
    }

    protected toInternalFormat(fieldType, value): string {
        return this.typeFormatter.toInternalFormat(fieldType, value);

    }

    protected setFieldValue(newValue: string): void {
        this.field.value = newValue;
    }

    protected setFormControlValue(newValue: string | string[]): void {
        this.field.formControl.markAsDirty();

        if (isEqual(this.field.formControl.value, newValue)) {
            return;
        }
        this.field.formControl.setValue(newValue);
    }

    protected unsubscribeAll(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
