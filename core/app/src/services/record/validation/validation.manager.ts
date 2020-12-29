import {Injectable} from '@angular/core';
import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {AsyncValidatorInterface} from '@services/record/validation/aync-validator.Interface';
import {OverridableMap} from '@app-common/types/OverridableMap';
import {RequiredValidator} from '@services/record/validation/validators/required.validator';
import {CurrencyValidator} from '@services/record/validation/validators/currency.validator';
import {DateValidator} from '@services/record/validation/validators/date.validator';
import {DateTimeValidator} from '@services/record/validation/validators/datetime.validator';
import {FloatValidator} from '@services/record/validation/validators/float.validator';
import {IntValidator} from '@services/record/validation/validators/int.validator';
import {EmailValidator} from '@services/record/validation/validators/email.validator';
import {PhoneValidator} from '@services/record/validation/validators/phone.validator';
import {RangeValidator} from '@services/record/validation/validators/range.validator';

export interface ValidationManagerInterface {
    registerValidator(module: string, key: string, validator: ValidatorInterface): void;

    excludeValidator(module: string, key: string): void;

    registerAsyncValidator(module: string, key: string, validator: AsyncValidatorInterface): void;

    excludeAsyncValidator(module: string, key: string): void;

    getValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];

    getAsyncValidations(module: string, viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn[];
}

@Injectable({
    providedIn: 'root'
})
export class ValidationManager implements ValidationManagerInterface {
    protected validators: OverridableMap<ValidatorInterface>;
    protected asyncValidators: OverridableMap<AsyncValidatorInterface>;

    constructor(
        protected requiredValidator: RequiredValidator,
        protected rangeValidator: RangeValidator,
        protected currencyValidator: CurrencyValidator,
        protected dateValidator: DateValidator,
        protected datetimeValidator: DateTimeValidator,
        protected emailValidator: EmailValidator,
        protected floatValidator: FloatValidator,
        protected intValidator: IntValidator,
        protected phoneValidator: PhoneValidator,
    ) {

        this.validators = new OverridableMap<ValidatorInterface>();
        this.asyncValidators = new OverridableMap<AsyncValidatorInterface>();

        this.validators.addEntry('default', 'required', requiredValidator);
        this.validators.addEntry('default', 'range', rangeValidator);
        this.validators.addEntry('default', 'currency', currencyValidator);
        this.validators.addEntry('default', 'date', dateValidator);
        this.validators.addEntry('default', 'datetime', datetimeValidator);
        this.validators.addEntry('default', 'email', emailValidator);
        this.validators.addEntry('default', 'float', floatValidator);
        this.validators.addEntry('default', 'int', intValidator);
        this.validators.addEntry('default', 'phone', phoneValidator);
    }

    public registerValidator(module: string, key: string, validator: ValidatorInterface): void {
        this.validators.addEntry(module, key, validator);
    }

    public excludeValidator(module: string, key: string): void {
        this.validators.excludeEntry(module, key);
    }

    public registerAsyncValidator(module: string, key: string, validator: AsyncValidatorInterface): void {
        this.asyncValidators.addEntry(module, key, validator);
    }

    public excludeAsyncValidator(module: string, key: string): void {
        this.validators.excludeEntry(module, key);
    }

    public getValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[] {
        let validations = [];

        const entries = this.validators.getGroupEntries(module);

        Object.keys(entries).forEach(validatorKey => {

            const validator = entries[validatorKey];

            if (validator.applies(record, viewField)) {
                validations = validations.concat(validator.getValidator(viewField, record));
            }
        });

        return validations;
    }

    public getAsyncValidations(module: string, viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn[] {
        const validations = [];

        const entries = this.asyncValidators.getGroupEntries(module);

        Object.keys(entries).forEach(validatorKey => {

            const validator = entries[validatorKey];

            if (validator.applies(record, viewField)) {
                validations.push(validator.getValidator(viewField, record));
            }
        });

        return validations;
    }
}
