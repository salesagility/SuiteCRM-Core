import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const floatValidator = (formatter: NumberFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        const invalid = formatter.validateFloatUserFormat(control.value);
        return invalid ? {
            floatValidator: {
                valid: false,
                format: formatter.getFloatUserFormatPattern(),
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_FLOAT_FORMAT',
                    context: {
                        value: control.value,
                        expected: formatter.toUserFormat('1000.50')
                    }
                }
            },
        } : null;
    }
);

@Injectable({
    providedIn: 'root'
})
export class FloatValidator implements ValidatorInterface {

    constructor(protected formatter: NumberFormatter) {
    }

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return viewField.type === 'float';
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        return [floatValidator(this.formatter)];
    }
}
