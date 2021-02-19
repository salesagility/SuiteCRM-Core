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

import {Injectable} from '@angular/core';
import {ValidatorInterface} from './validator.Interface';
import {Record} from 'common';
import {ViewFieldDefinition} from 'common';
import {AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {AsyncValidatorInterface} from './aync-validator.Interface';
import {MapEntry, OverridableMap} from 'common';
import {RequiredValidator} from './validators/required.validator';
import {CurrencyValidator} from './validators/currency.validator';
import {DateValidator} from './validators/date.validator';
import {DateTimeValidator} from './validators/datetime.validator';
import {FloatValidator} from './validators/float.validator';
import {IntValidator} from './validators/int.validator';
import {EmailValidator} from './validators/email.validator';
import {PhoneValidator} from './validators/phone.validator';
import {RangeValidator} from './validators/range.validator';

export interface ValidationManagerInterface {
    registerSaveValidator(module: string, key: string, validator: ValidatorInterface): void;

    registerFilterValidator(module: string, key: string, validator: ValidatorInterface): void;

    excludeSaveValidator(module: string, key: string): void;

    excludeFilterValidator(module: string, key: string): void;

    registerAsyncSaveValidator(module: string, key: string, validator: AsyncValidatorInterface): void;

    excludeAsyncSaveValidator(module: string, key: string): void;

    getSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];

    getFilterValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];

    getAsyncSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn[];
}

@Injectable({
    providedIn: 'root'
})
export class ValidationManager implements ValidationManagerInterface {
    protected saveValidators: OverridableMap<ValidatorInterface>;
    protected asyncSaveValidators: OverridableMap<AsyncValidatorInterface>;
    protected filterValidators: OverridableMap<ValidatorInterface>;

    constructor(
        protected requiredValidator: RequiredValidator,
        protected rangeValidator: RangeValidator,
        protected currencyValidator: CurrencyValidator,
        protected dateValidator: DateValidator,
        protected datetimeValidator: DateTimeValidator,
        protected emailValidator: EmailValidator,
        protected floatValidator: FloatValidator,
        protected intValidator: IntValidator,
        protected phoneValidator: PhoneValidator,
    ) {

        this.saveValidators = new OverridableMap<ValidatorInterface>();
        this.asyncSaveValidators = new OverridableMap<AsyncValidatorInterface>();
        this.filterValidators = new OverridableMap<ValidatorInterface>();

        this.saveValidators.addEntry('default', 'required', requiredValidator);
        this.saveValidators.addEntry('default', 'range', rangeValidator);
        this.saveValidators.addEntry('default', 'currency', currencyValidator);
        this.saveValidators.addEntry('default', 'date', dateValidator);
        this.saveValidators.addEntry('default', 'datetime', datetimeValidator);
        this.saveValidators.addEntry('default', 'email', emailValidator);
        this.saveValidators.addEntry('default', 'float', floatValidator);
        this.saveValidators.addEntry('default', 'int', intValidator);
        this.saveValidators.addEntry('default', 'phone', phoneValidator);

        this.filterValidators.addEntry('default', 'date', dateValidator);
        this.filterValidators.addEntry('default', 'datetime', datetimeValidator);
        this.filterValidators.addEntry('default', 'float', floatValidator);
        this.filterValidators.addEntry('default', 'currency', currencyValidator);
        this.filterValidators.addEntry('default', 'int', intValidator);
        this.filterValidators.addEntry('default', 'phone', phoneValidator);
    }

    public registerSaveValidator(module: string, key: string, validator: ValidatorInterface): void {
        this.filterValidators.addEntry(module, key, validator);
    }

    public registerFilterValidator(module: string, key: string, validator: ValidatorInterface): void {
        this.saveValidators.addEntry(module, key, validator);
    }

    public excludeSaveValidator(module: string, key: string): void {
        this.saveValidators.excludeEntry(module, key);
    }

    public excludeFilterValidator(module: string, key: string): void {
        this.filterValidators.excludeEntry(module, key);
    }

    public registerAsyncSaveValidator(module: string, key: string, validator: AsyncValidatorInterface): void {
        this.asyncSaveValidators.addEntry(module, key, validator);
    }

    public excludeAsyncSaveValidator(module: string, key: string): void {
        this.saveValidators.excludeEntry(module, key);
    }

    public getSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[] {
        const entries = this.saveValidators.getGroupEntries(module);
        return this.filterValidations(entries, record, viewField);
    }

    public getFilterValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[] {
        const entries = this.filterValidators.getGroupEntries(module);
        return this.filterValidations(entries, record, viewField);
    }

    public getAsyncSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn[] {
        const validations = [];

        const entries = this.asyncSaveValidators.getGroupEntries(module);

        Object.keys(entries).forEach(validatorKey => {

            const validator = entries[validatorKey];

            if (validator.applies(record, viewField)) {
                validations.push(validator.getValidator(viewField, record));
            }
        });

        return validations;
    }

    protected filterValidations(entries: MapEntry<ValidatorInterface>, record: Record, viewField: ViewFieldDefinition): ValidatorFn[] {
        let validations = [];

        Object.keys(entries).forEach(validatorKey => {

            const validator = entries[validatorKey];

            if (validator.applies(record, viewField)) {
                validations = validations.concat(validator.getValidator(viewField, record));
            }
        });

        return validations;
    }
}
