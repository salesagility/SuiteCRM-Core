import {SearchCriteriaFieldFilter} from '@store/list-view/list-view.store';

export interface FieldMetadata {
    format?: boolean;
    target?: string;
    link?: boolean;
    rows?: number;
    cols?: number;
}

export interface Field {
    type: string;
    value?: string;
    name?: string;
    label?: string;
    labelKey?: string;
    metadata?: FieldMetadata;
    criteria?: SearchCriteriaFieldFilter;
}
