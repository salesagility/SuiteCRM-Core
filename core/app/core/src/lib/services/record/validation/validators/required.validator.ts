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
import {ValidatorInterface} from '../validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from 'common';
import {ViewFieldDefinition} from 'common';
import {StandardValidationErrors, StandardValidatorFn} from 'common';
import {FormControlUtils} from '../../field/form-control.utils';

export const requiredValidator = (utils: FormControlUtils): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        if (utils.isEmptyTrimmedInputValue(control.value)) {
            return {
                required: {
                    required: true,
                    message: {
                        labelKey: 'LBL_VALIDATION_ERROR_REQUIRED',
                        context: {
                            value: control.value
                        }
                    }
                }
            };
        }

        return null;
    }
);

export const booleanRequiredValidator = (utils: FormControlUtils): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        if (utils.isEmptyBooleanInputValue(control.value)) {
            return {
                required: {
                    required: true,
                    message: {
                        labelKey: 'LBL_VALIDATION_ERROR_REQUIRED',
                        context: {
                            value: control.value
                        }
                    }
                }
            };
        }

        return null;
    }
);

@Injectable({
    providedIn: 'root'
})
export class RequiredValidator implements ValidatorInterface {

    constructor(protected utils: FormControlUtils) {
    }

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return !!viewField.fieldDefinition.required;
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if(viewField.type === 'boolean'){
            return [booleanRequiredValidator(this.utils)];
        }

        return [requiredValidator(this.utils)];
    }

}
