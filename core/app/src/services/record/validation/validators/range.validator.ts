import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl, Validators} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {FieldDefinition, ValidationDefinition} from '@app-common/record/field.model';
import {Injectable} from '@angular/core';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const minValidator = (min: number): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const result = Validators.min(min)(control);

        if (result === null) {
            return null;
        }

        return {
            emailValidator: {
                ...result,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_MIN',
                    context: {
                        value: control.value,
                        min: '' + min
                    }
                }
            }
        };
    }
);

export const maxValidator = (max: number): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const result = Validators.max(max)(control);

        if (result === null) {
            return null;
        }

        return {
            emailValidator: {
                ...result,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_MAX',
                    context: {
                        value: control.value,
                        max: '' + max
                    }
                }
            }
        };
    }
);

@Injectable({
    providedIn: 'root'
})
export class RangeValidator implements ValidatorInterface {

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        const definition = viewField.fieldDefinition;

        return this.getRangeValidation(definition) !== null;
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        const validation = this.getRangeValidation(viewField.fieldDefinition);

        if (!validation) {
            return [];
        }

        const min = validation.min && parseInt('' + validation.min, 10);
        const max = validation.max && parseInt('' + validation.max, 10);
        const validations = [];

        if (isFinite(min)) {
            validations.push(minValidator(min));
        }

        if (isFinite(max)) {
            validations.push(maxValidator(max));
        }

        return validations;
    }

    protected getRangeValidation(definition: FieldDefinition): ValidationDefinition {

        if (this.isRangeValidation(definition.validation)) {
            return definition.validation;
        }

        if (!definition.validations || !definition.validations.length) {
            return null;
        }

        let validation: ValidationDefinition = null;

        definition.validations.some(entry => {
            validation = entry;
            return this.isRangeValidation(entry);
        });

        return validation;
    }

    protected isRangeValidation(validation: ValidationDefinition): boolean {
        return validation && validation.type === 'range';
    }
}
