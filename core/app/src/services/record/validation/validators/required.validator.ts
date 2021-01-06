import {Injectable} from '@angular/core';
import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';
import {FormControlUtils} from '@services/record/field/form-control.utils';

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

    getValidator(): StandardValidatorFn[] {
        return [requiredValidator(this.utils)];
    }

}
