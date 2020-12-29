import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {PhoneFormatter} from '@services/formatters/phone/phone-formatter.service';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const phoneValidator = (formatter: PhoneFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        if (control.value == null || control.value.length === 0) {
            return null;
        }

        const pattern = formatter.getUserFormatPattern();
        const regex = new RegExp(pattern, 'g');

        if (regex.test(control.value)) {
            return null;
        }

        return {
            phoneValidator: {
                valid: false,
                format: pattern,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_PHONE_FORMAT',
                    context: {
                        value: control.value
                    }
                }
            }
        };
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
