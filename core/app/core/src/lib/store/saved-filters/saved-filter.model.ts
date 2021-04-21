import {Field, FieldMap, Record, SearchCriteria} from 'common';
import {RecordList} from '../record-list/record-list.store';
import {FormGroup} from '@angular/forms';

export interface SavedFilterAttributeMap {
    id?: string;
    name?: string;
    searchModule?: string;
    assigned_user_id?: string;
    contents?: any;
    date_entered?: string;
    date_modified?: string;

    [key: string]: any;
}


export interface SavedFilterFieldMap {
    id?: Field;
    name?: Field;
    search_module?: Field;
    assigned_user_id?: Field;
    contents?: Field;
    date_entered?: Field;
    date_modified?: Field;

    [key: string]: Field;
}

export interface SavedFilterMap {
    [key: string]: SavedFilter;
}

export interface SavedFilter extends Record {
    key?: string;
    searchModule?: string;
    criteria?: SearchCriteria;
    criteriaFields?: FieldMap;
    criteriaFormGroup?: FormGroup;
    attributes: SavedFilterAttributeMap;
    fields?: SavedFilterFieldMap;
}

export interface SavedFilterList extends RecordList {
    records: SavedFilter[];
}
