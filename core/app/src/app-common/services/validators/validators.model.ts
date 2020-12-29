import {StringMap} from '@app-common/types/StringMap';
import {AbstractControl, ValidatorFn} from '@angular/forms';

export interface StandardValidationErrors {
    [key: string]: StandardValidationError;
}

export interface StandardValidationError {
    [key: string]: any;

    message: MessageInfo;
}

export interface MessageInfo {
    labelKey: string;
    context: StringMap;
}

export declare interface StandardValidatorFn extends ValidatorFn {
    (control: AbstractControl): StandardValidationErrors | null;
}
