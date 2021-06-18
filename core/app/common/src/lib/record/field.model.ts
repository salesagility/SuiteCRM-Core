/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {SearchCriteriaFieldFilter} from '../views/list/search-criteria.model';
import {Observable} from 'rxjs';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {Record} from './record.model';

export interface Option {
    value: string;
    label?: string;
    labelKey?: string;
}

export interface ValidationDefinition {
    [key: string]: number | string;

    type: string;
    min?: number | string;
    max?: number | string;
    compareto?: string;
    blank?: string;
}

export interface FieldDefinitionMap {
    [key: string]: FieldDefinition;
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
    display?: string;
    displayType?: string;
    displayDirection?: string;
    layout?: string[];
    showLabel?: string[];
    groupFields?: FieldDefinitionMap;
    dynamic?: boolean;
    parentenum?: string;
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
    extraOptions?: Option[];
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
    display?: string;
    metadata?: FieldMetadata;
    definition?: FieldDefinition;
    criteria?: SearchCriteriaFieldFilter;
    formControl?: FormControl;
    validators?: ValidatorFn[];
    asyncValidators?: AsyncValidatorFn[];
}

