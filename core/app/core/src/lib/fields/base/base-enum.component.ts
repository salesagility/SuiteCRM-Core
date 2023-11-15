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

import {isEmpty, isNull, isObject} from 'lodash-es';
import {combineLatest, of, Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {deepClone, Field, FieldValue, isEmptyString, isVoid, Option} from 'common';
import {BaseFieldComponent} from './base-field.component';
import {DataTypeFormatter} from '../../services/formatters/data-type.formatter.service';
import {LanguageListStringMap, LanguageStore, LanguageStringMap} from '../../store/language/language.store';
import {FieldLogicManager} from '../field-logic/field-logic.manager';
import {FieldLogicDisplayManager} from '../field-logic-display/field-logic-display.manager';

@Component({template: ''})
export class BaseEnumComponent extends BaseFieldComponent implements OnInit, OnDestroy {
    selectedValues: Option[] = [];
    valueLabel = '';
    optionsMap: LanguageStringMap = {};
    options: Option[] = [];
    labels: LanguageStringMap;
    protected subs: Subscription[] = [];
    protected mappedOptions: { [key: string]: Option[] };

    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager,
        protected logicDisplay: FieldLogicDisplayManager
    ) {
        super(typeFormatter, logic, logicDisplay);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.subscribeValueAndOptionChanges();

        this.initAsEnumAndDynamicIf();
    }

    getInvalidClass(): string {
        if (this.field.formControl && this.field.formControl.invalid && this.field.formControl.touched) {
            return 'is-invalid';
        }
        return '';
    }


    protected initValue(): void {
        const fieldValue = this.field.value ?? '';

        if (isEmptyString(fieldValue)) {
            this.initEnumDefault();
            return;
        }

        if (
            !isEmpty(this.field.options)
            && !this.field.options.find(option => option.value === fieldValue)
        ) {
            this.updateInternalState();
            return;
        }

        this.updateInternalState(fieldValue);
    }

    /**
     *  Initialize the default value for the enum
     *
     *  @returns {void}
     *  @description set default enum value, if defined in vardefs
     * */
    protected initEnumDefault(): void {
        const defaultValue = this.field.definition?.default;

        if (
            isEmptyString(this.record?.id)
            && !isVoid(defaultValue)
        ) {
            this.updateInternalState(defaultValue);
            return;
        }

        this.updateInternalState();
    }

    protected updateInternalState(value = ''): void {
        this.selectedValues = [];
        const option = this.buildOptionFromValue(value);
        if (!isEmptyString(option.value)) {
            this.selectedValues.push(option);
        }
        this.valueLabel = option.label;
        this.setFormControlValue(option.value);
    }

    protected buildOptionFromValue(value: string): Option {
        const option: Option = {value: '', label: ''};

        if (isNull(value)) {
            return option;
        }
        option.value = (typeof value !== 'string' ? JSON.stringify(value) : value).trim();
        option.label = option.value;

        const valueLabel = this.optionsMap[option.value] ?? option.label;
        if (isObject(valueLabel)) {
            return option;
        }
        option.label = (typeof valueLabel !== 'string' ? JSON.stringify(valueLabel) : valueLabel).trim();

        return option;
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
        const extraOptions = this.field.metadata?.extraOptions ?? [];

        extraOptions.forEach(extraOption=>options.push(extraOption));
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

    private subscribeValueAndOptionChanges(): void {
        this.subscribeValueChanges();

        const valueAndOptionChanges = combineLatest([
            this.field.valueChanges$,
            this.field.optionsChanges$
        ]).subscribe(([_, options]) => {
            if (options) {
                this.buildProvidedOptions(options);
            }
            this.initValue();
        });

        this.subs.push(valueAndOptionChanges);
    }

    private initAsEnumAndDynamicIf(): void {
        const definition = (this.field.definition ?? {});
        const dynamic = definition?.dynamic ?? false;
        const parentEnumKey = definition?.parentenum ?? '';
        const fields = this.record?.fields ?? {};

        const parentEnum = dynamic ? fields[parentEnumKey] ?? null : null;

        this.subscribeToParentValueChanges(parentEnum);
    }

    private subscribeToParentValueChanges(parentEnum: Field | null): void {
        const parentValueChangesSubscription = combineLatest([
            parentEnum?.valueChanges$ ?? of({} as FieldValue),
            this.languages.vm$
        ]).subscribe(([parentFieldValue, languageStrings]) => {
            const appStrings = languageStrings.appListStrings ?? {};
            const optionsKey = this.field.definition?.options ?? '';

            const optionsMap = (appStrings[optionsKey] ?? {}) as LanguageStringMap;
            let options: Option[] = Object.entries(optionsMap)
                .map(([value, label]) => ({value, label}));

            options = this.getDynamicEnumOptions(parentEnum,appStrings,parentFieldValue,options);

            this.field.options = options;
        });

        this.subs.push(parentValueChangesSubscription);
    }

    private getDynamicEnumOptions(
        parentEnum: Field | null,
        appStrings: LanguageListStringMap,
        parentFieldValue: FieldValue,
        prevOptions: Option[]
    ): Option[] {
        if (isEmpty(parentEnum)) {
            return prevOptions;
        }

        const parentOptionsKey = parentEnum?.definition.options ?? '';

        const parentOptionMap: LanguageStringMap = (appStrings[parentOptionsKey] ?? {}) as LanguageStringMap;
        if (isEmpty(parentOptionMap)) {
            return prevOptions;
        }

        this.mappedOptions = this.createParentChildOptionsMap(parentOptionMap, prevOptions);
        let parentValues: string[] = [];
        if (!isEmpty(parentFieldValue.valueList)) {
            parentValues = parentFieldValue.valueList;
        } else if (parentEnum.value) {
            parentValues = [parentFieldValue.value ?? ''];
        }

        return this.filterMatchingOptions(parentValues);
    }

    private createParentChildOptionsMap(parentOptions: LanguageStringMap, childOptions: Option[]): { [key: string]: Option[] } {
        const mappedOptions: { [key: string]: Option[] } = {};
        Object.keys(parentOptions).forEach(key => {
            mappedOptions[key] = childOptions.filter(
                option => String(option.value).startsWith(key)
            );
        });
        return mappedOptions;
    }

    private filterMatchingOptions(values: string[]): Option[] {
        if (isEmpty(values)) {
            return [];
        }

        let filteredOptions: Option[] = [];
        values.forEach(value => {
            if (!this.mappedOptions[value]) {
                return;
            }
            filteredOptions = filteredOptions.concat([...deepClone(this.mappedOptions[value])]);
        });

        return filteredOptions;
    }
}
