import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {PhoneFormatter} from '@services/formatters/phone/phone-formatter.service';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const phoneValidator = (formatter: PhoneFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const invalid = formatter.validateUserFormat(control.value);
        return invalid ? {
            phoneValidator: {
                valid: false,
                format: formatter.getUserFormatPattern(),
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_PHONE_FORMAT',
                    context: {
                        value: control.value
                    }
                }
            },
        } : null;
    }
);

@Injectable({
    providedIn: 'root'
})
export class PhoneValidator implements ValidatorInterface {

    constructor(protected formatter: PhoneFormatter) {
    }

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return viewField.type === 'phone';
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        return [phoneValidator(this.formatter)];
    }
}
