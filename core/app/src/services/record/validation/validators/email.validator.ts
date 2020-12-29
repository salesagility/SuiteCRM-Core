import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl, Validators} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const emailValidator = (): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const result = Validators.email(control);

        if (result === null) {
            return null;
        }

        return {
            emailValidator: {
                ...result,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_EMAIL_FORMAT',
                    context: {
                        value: control.value,
                        expected: 'example@example.org'
                    }
                }
            }
        };
    }
);


@Injectable({
    providedIn: 'root'
})
export class EmailValidator implements ValidatorInterface {

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return viewField.type === 'email';
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        return [emailValidator()];
    }
}
