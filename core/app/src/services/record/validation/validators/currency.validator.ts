import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {AbstractControl} from '@angular/forms';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Injectable} from '@angular/core';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {StandardValidationErrors, StandardValidatorFn} from '@app-common/services/validators/validators.model';

export const currencyValidator = (formatter: NumberFormatter): StandardValidatorFn => (
    (control: AbstractControl): StandardValidationErrors | null => {

        if (control.value == null || control.value.length === 0) {
            return null;
        }

        const pattern = formatter.getFloatUserFormatPattern();
        const regex = new RegExp(pattern);

        if (regex.test(control.value)) {
            return null;
        }

        return {
            currencyValidator: {
                valid: false,
                format: pattern,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_CURRENCY_FORMAT',
                    context: {
                        value: control.value,
                        expected: formatter.toUserFormat('1000.50')
                    }
                }
            }
        };
    }
);


@Injectable({
    providedIn: 'root'
})
export class CurrencyValidator implements ValidatorInterface {

    constructor(protected formatter: NumberFormatter) {
    }

    applies(record: Record, viewField: ViewFieldDefinition): boolean {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }

        return viewField.type === 'currency';
    }

    getValidator(viewField: ViewFieldDefinition): StandardValidatorFn[] {

        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }

        return [currencyValidator(this.formatter)];
    }
}
