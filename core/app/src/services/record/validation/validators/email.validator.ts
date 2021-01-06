import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';
import {EmailFormatter} from '@services/formatters/email/email-formatter.service';

export const emailValidator = (formatter: EmailFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const invalid = formatter.validateUserFormat(control.value);
        return invalid ? {
            emailValidator: {
                valid: false,
                format: formatter.getUserFormatPattern(),
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_EMAIL_FORMAT',
                    context: {
                        value: control.value,
                        expected: 'example@example.org'
                    }
                }
            },
        } : null;
    }
);


@Injectable({
    providedIn: 'root'
})
export class EmailValidator implements ValidatorInterface {

    constructor(protected formatter: EmailFormatter) {
    }

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

        return [emailValidator(this.formatter)];
    }
}
