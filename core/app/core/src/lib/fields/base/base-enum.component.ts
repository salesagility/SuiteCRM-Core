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

import {BaseFieldComponent} from './base-field.component';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Field, FieldDefinition, isEmptyString, isVoid, Option} from 'common';
import {DataTypeFormatter} from '../../services/formatters/data-type.formatter.service';
import {
    LanguageListStringMap,
    LanguageStore,
    LanguageStringMap,
    LanguageStrings
} from '../../store/language/language.store';
import {FieldLogicManager} from '../field-logic/field-logic.manager';

@Component({template: ''})
export class BaseEnumComponent extends BaseFieldComponent implements OnInit, OnDestroy {
    selectedValues: Option[] = [];
    valueLabel = '';
    optionsMap: LanguageStringMap;
    options: Option[] = [];
    labels: LanguageStringMap;
    protected subs: Subscription[] = [];
    protected mappedOptions: { [key: string]: Option[] };
    protected isDynamicEnum = false;

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter, protected logic: FieldLogicManager) {
        super(typeFormatter, logic);
    }

    ngOnInit(): void {

        super.ngOnInit();

        this.subs.push(
            this.field.optionsChanges$.subscribe((options: Option[]) => {
                if (options) {
                    this.buildProvidedOptions(options);
                }
                this.initValue();
            })
        );

        if (this.field.definition && this.field.definition.options) {
            this.subs.push(this.languages.vm$.subscribe((strings: LanguageStrings) => {
                const optionsKey = this.field.definition?.options ?? '';
                const appStrings = strings.appListStrings ?? {};

                const optionsMap = (appStrings[optionsKey] as LanguageStringMap) ?? {};
                let options: Option[] = Object.entries(optionsMap)
                    .map(([value, label]) => ({value, label}));
                if (this.isDynamicEnum) {
                    options = this.getDynamicEnumOptions(appStrings, options);
                }

                this.field.options = options;
            }));
        }

        this.initValue();

    }

    ngOnDestroy(): void {
        this.isDynamicEnum = false;
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getInvalidClass(): string {
        if (this.field.formControl && this.field.formControl.invalid && this.field.formControl.touched) {
            return 'is-invalid';
        }
        return '';
    }

    protected buildProvidedOptions(options: Option[]): void {
        this.addExtraOptions(options);
        this.addConditionalOptions(options);

        this.optionsMap = {} as LanguageStringMap;
        options.forEach(option => this.addToOptionMap(option));

        this.options = Object.entries(this.optionsMap)
            .map(([value, label]) => ({value, label}));
    }

    protected addExtraOptions(options: Option[]): void {
        const extraOptions = (this.field.metadata && this.field.metadata.extraOptions) || [];

        extraOptions.forEach(extraOption => options.push(extraOption));
    }

    protected addConditionalOptions(options: Option[]): void {
        const conditionalOptions = this.field.metadata?.conditionalOptions ?? {};

        Object.values(conditionalOptions).forEach(extraOption => options.push(extraOption));
    }

    protected addToOptionMap(option: Option): void {
        if (isVoid(option.value)) {
            return;
        }

        let label = option.label || '';
        if (option.labelKey) {
            label = this.languages.getFieldLabel(option.labelKey, this.record.module) || option.labelKey;
        }

        this.optionsMap[option.value] = label;
    }

    protected initValue(): void {

        this.selectedValues = [];

        if (!this.field.value) {
            this.initEnumDefault();
            return;
        }

        if (typeof this.field.value !== 'string') {
            return;
        }

        if (!this.optionsMap) {
            return;
        }

        if (typeof this.optionsMap[this.field.value] !== 'string') {
            return;
        }

        if (this.field.value) {
            this.valueLabel = this.optionsMap[this.field.value];
            this.selectedValues.push({
                value: this.field.value,
                label: this.valueLabel
            });
        }
    }

    /**
     *  Initialize the default value for the enum
     *
     *  @returns {void}
     *  @description set default enum value, if defined in vardefs
     * */
    protected initEnumDefault(): void {

        if (!isEmptyString(this.record?.id)) {

            this.field?.formControl.setValue('');

            return;
        }

        let defaultVal = this.field?.definition?.default;
        if (typeof defaultVal === 'string') {
            defaultVal = defaultVal.trim();
        }
        if (!defaultVal) {
            this.field.formControl.setValue('');
            return;
        }

        this.selectedValues.push({
            value: defaultVal,
            label: this.optionsMap[defaultVal]
        });

        this.initEnumDefaultFieldValues(defaultVal);
    }

    protected initEnumDefaultFieldValues(defaultVal: string): void {

        if (this.field.type === 'multienum') {
            const defaultValues = this.selectedValues.map(option => option.value);
            this.field.valueList = defaultValues;
            this.field.formControl.setValue(defaultValues);

        } else {
            this.field.value = defaultVal;
            this.field.formControl.setValue(defaultVal);
        }
        this.field.formControl.markAsDirty();
    }

    protected checkAndInitAsDynamicEnum(): void {

        const definition = (this.field && this.field.definition) || {} as FieldDefinition;
        const dynamic = (definition && definition.dynamic) || false;
        const parentEnumKey = (definition && definition.parentenum) || '';
        const fields = (this.record && this.record.fields) || null;

        if (dynamic && parentEnumKey && fields) {
            this.isDynamicEnum = true;
            const parentEnum: Field = fields[parentEnumKey];
            if (parentEnum) {
                this.subscribeToParentValueChanges(parentEnum);
            }
        }
    }

    protected getDynamicEnumOptions(appStrings: LanguageListStringMap, options: Option[]): Option[] {
        const parentEnum = this.record.fields[this.field.definition.parentenum];

        if (!parentEnum) {
            return options;
        }

        const parentOptionMap: LanguageStringMap = appStrings[parentEnum.definition.options] as LanguageStringMap;

        if (!(parentOptionMap && Object.keys(parentOptionMap).length !== 0)) {
            return options;
        }

        this.mappedOptions = this.createParentChildOptionsMap(parentOptionMap, options);

        let parentValues: string[] = [];
        if (parentEnum.definition.type === 'multienum') {
            parentValues = parentEnum.valueList;
        } else {
            parentValues.push(parentEnum.value);
        }

        return this.filterMatchingOptions(parentValues);
    }

    protected filterMatchingOptions(values: string[]): Option[] {

        let filteredOptions: Option[] = [];

        if (!values || !values.length) {
            return [];
        }

        values.forEach(value => {
            if (!this.mappedOptions[value]) {
                return;
            }
            filteredOptions = filteredOptions.concat([...this.mappedOptions[value]]);
        });

        return filteredOptions;
    }

    protected createParentChildOptionsMap(parentOptions: LanguageStringMap, childOptions: Option[]): { [key: string]: Option[] } {
        const mappedOptions: { [key: string]: Option[] } = {};
        Object.keys(parentOptions).forEach(key => {
            mappedOptions[key] = childOptions.filter(
                option => String(option.value).startsWith(key)
            );
        });
        return mappedOptions;
    }

    protected subscribeToParentValueChanges(parentEnum: Field): void {
        if (parentEnum.formControl) {
            this.subs.push(parentEnum.formControl.valueChanges.subscribe(values => {

                if (typeof values === 'string') {
                    values = [values];
                }

                // Reset selected values on Form Control
                this.field.value = '';
                this.field.formControl.setValue('');

                // Rebuild available enum options
                this.options = this.filterMatchingOptions(values);

                this.initValue();
            }));
        }
    }

}
