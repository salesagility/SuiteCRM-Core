import {Injectable} from '@angular/core';
import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const requiredValidator = (): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {
        if (control.value == null || control.value.length === 0) {
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

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return !!viewField.fieldDefinition.required;
    }

    getValidator(): StandardValidatorFn[] {
        return [requiredValidator()];
    }

}
