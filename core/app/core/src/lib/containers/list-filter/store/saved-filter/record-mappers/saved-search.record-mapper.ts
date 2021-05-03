import {deepClone, Record, RecordMapper} from 'common';
import {Injectable} from '@angular/core';
import {SavedFilter} from '../../../../../store/saved-filters/saved-filter.model';

@Injectable({
    providedIn: 'root'
})
export class SavedSearchRecordMapper implements RecordMapper {

    getKey(): string {
        return 'criteria';
    }

    map(record: Record): void {
        const savedFilter: SavedFilter = record;
        if (savedFilter.criteria) {
            const contents = savedFilter.attributes.contents || {};
            contents.filters = deepClone(savedFilter.criteria.filters || {});

            if (record.fields.name) {
                contents.name = record.fields.name.value;
                savedFilter.criteria.name = contents.name;
            }

            if (record.fields.orderBy) {
                contents.orderBy = record.fields.orderBy.value;
                savedFilter.criteria.orderBy = contents.orderBy;
            }

            if (record.fields.sortOrder) {
                contents.sortOrder = record.fields.sortOrder.value;
                savedFilter.criteria.sortOrder = contents.sortOrder;
            }

            if (record.attributes.search_module) {
                contents.searchModule = record.attributes.search_module;
                savedFilter.criteria.searchModule = contents.searchModule;
            }

            savedFilter.attributes.contents = contents;
        }

        let key = savedFilter.key || '';
        if (key === 'default') {
            key = '';
        }

        savedFilter.id = key;
        savedFilter.attributes.id = key;
    }
}
