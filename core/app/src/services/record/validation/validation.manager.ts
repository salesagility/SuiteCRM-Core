import {Injectable} from '@angular/core';
import {ValidatorInterface} from '@services/record/validation/validator.Interface';
import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {AsyncValidatorInterface} from '@services/record/validation/aync-validator.Interface';
import {OverridableMap} from '@app-common/types/OverridableMap';
import {RequiredValidator} from '@services/record/validation/validators/required.validator';

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
    ) {

        this.validators = new OverridableMap<ValidatorInterface>();
        this.asyncValidators = new OverridableMap<AsyncValidatorInterface>();

        this.validators.addEntry('default', 'required', requiredValidator);
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
