import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const dateTimeValidator = (formatter: DatetimeFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        if (control.value == null || control.value.length === 0) {
            return null;
        }

        const invalid = formatter.validateUserFormat(control.value);
        return invalid ? {
            dateTimeValidator: {
                value: control.value,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_DATETIME_FORMAT',
                    context: {
                        value: control.value,
                        expected: formatter.toUserFormat('2020-01-23 12:30:40')
                    }
                }
            },
        } : null;
    }
);

@Injectable({
    providedIn: 'root'
})
export class DateTimeValidator implements ValidatorInterface {

    constructor(protected formatter: DatetimeFormatter) {
    }

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return viewField.type === 'datetime';
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        return [dateTimeValidator(this.formatter)];
    }
}
