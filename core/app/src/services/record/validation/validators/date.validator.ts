import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';
import {FormControlUtils} from '@services/record/field/form-control.utils';

export const dateValidator = (formatter: DateFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const invalid = formatter.validateUserFormat(control.value);
        return invalid ? {
            invalidDate: {
                value: control.value,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_DATE_FORMAT',
                    context: {
                        value: control.value,
                        expected: formatter.toUserFormat('2020-01-23')
                    }
                }
            },

        } : null;
    }
);

@Injectable({
    providedIn: 'root'
})
export class DateValidator implements ValidatorInterface {

    constructor(protected formatter: DateFormatter, protected utils: FormControlUtils) {
    }

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return viewField.type === 'date';
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        return [dateValidator(this.formatter)];
    }


}
