import {Injectable} from '@angular/core';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {RecordListStore} from '@store/record-list/record-list.store';
import {map, shareReplay, take} from 'rxjs/operators';
import {Record} from '@app-common/record/record.model';
import {Observable} from 'rxjs';

@Injectable()
export class RelateService {
    recordList: RecordListStore;

    constructor(recordListStoreFactory: RecordListStoreFactory) {
        this.recordList = recordListStoreFactory.create();
    }

    init(module: string): void {
        this.recordList.init(module, false);
    }

    search(term: string, field: string): Observable<Record[]> {

        const criteria = this.recordList.criteria;
        criteria.filters[field] = {
            field,
            operator: '=',
            values: [term]
        };

        this.recordList.updateSearchCriteria(criteria, false);
        return this.recordList.load(false).pipe(
            map(value => value.records),
            take(1),
            shareReplay(1)
        );
    }

}
