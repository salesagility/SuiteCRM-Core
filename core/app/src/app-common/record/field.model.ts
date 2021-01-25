import {SearchCriteriaFieldFilter} from '@app-common/views/list/search-criteria.model';
import {Observable} from 'rxjs';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {Record} from '@app-common/record/record.model';

export interface Option {
    value: string;
    label: string;
}

export interface ValidationDefinition {
    [key: string]: number | string;

    type: string;
    min?: number | string;
    max?: number | string;
    compareto?: string;
    blank?: string;
}

export interface FieldDefinition {
    name?: string;
    type?: string; // label key to use
    vname?: string; // original label
    options?: string;
    reportable?: boolean;
    required?: boolean;
    // eslint-disable-next-line camelcase
    duplicate_merge?: string;
    source?: string;
    id?: string;
    // eslint-disable-next-line camelcase
    id_name?: string;
    link?: string;
    module?: string;
    rname?: string;
    table?: string;
    readonly?: boolean;
    // eslint-disable-next-line camelcase
    inline_edit?: boolean;
    validation?: ValidationDefinition;
    validations?: ValidationDefinition[];
    template?: string;
}

export declare type FieldClickCallback = (field: Field, record: Record) => void;

export interface FieldMetadata {
    format?: boolean;
    target?: string;
    link?: boolean;
    rows?: number;
    cols?: number;
    digits?: number;
    options$?: Observable<Option[]>;
    onClick?: FieldClickCallback;
}

export interface FieldMap {
    [key: string]: Field;
}

export interface Field {
    type: string;
    value?: string;
    valueList?: string[];
    valueObject?: any;
    name?: string;
    label?: string;
    labelKey?: string;
    metadata?: FieldMetadata;
    definition?: FieldDefinition;
    criteria?: SearchCriteriaFieldFilter;
    formControl?: FormControl;
    validators?: ValidatorFn[];
    asyncValidators?: AsyncValidatorFn[];
}

