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


import {Injectable} from '@angular/core';
import {RecordListStoreFactory} from '../../../../store/record-list/record-list.store.factory';
import {RecordStoreList} from './base-record-thread.store';
import {Observable} from 'rxjs';
import {Record, SearchCriteria, SortDirection} from 'common';
import {map} from 'rxjs/operators';
import {RecordThreadItemStoreFactory} from './record-thread-item.store.factory';
import {RecordThreadItemMetadata} from './record-thread-item.store.model';
import {RecordThreadItemStore} from './record-thread-item.store';

@Injectable()
export class RecordThreadStore extends RecordStoreList<RecordThreadItemStore, RecordThreadItemMetadata> {

    metadata: RecordThreadItemMetadata;
    $loading: Observable<boolean>;

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected recordStoreFactory: RecordThreadItemStoreFactory
    ) {
        super(listStoreFactory, recordStoreFactory);
        this.$loading = this.recordList.loading$;
    }

    public init(module: string, load = true): void {
        super.init(module, load);
    }

    setFilters(filters: SearchCriteria): Observable<Record[]> {

        let criteria = this.recordList.criteria;
        criteria = {
            ...criteria,
            ...filters
        };

        if (filters && filters.orderBy) {
            let sortOrder = SortDirection.DESC;
            if (filters.sortOrder && String(filters.sortOrder).toUpperCase() === 'ASC') {
                sortOrder = SortDirection.ASC;
            }

            this.recordList.updateSorting(filters.orderBy, sortOrder, false);
        }

        this.recordList.updateSearchCriteria(criteria, false);
        return this.load(false).pipe(
            map(value => value.records),
        );
    }

    public getMetadata(): RecordThreadItemMetadata {
        return this.metadata;
    }

    public setMetadata(meta: RecordThreadItemMetadata) {
        return this.metadata = meta;
    }

    public allLoaded(): boolean {
        const pagination = this.recordList.getPagination();
        if (!pagination) {
            return false;
        }

        return pagination.pageSize >= pagination.total;
    }

    public loadMore(jump: number = 10): void {
        const pagination = this.recordList.getPagination();
        const currentPageSize = pagination.pageSize || 0;
        let newPageSize = currentPageSize + jump;

        this.recordList.setPageSize(newPageSize);
        this.recordList.updatePagination(0);
    }

    public reload(): void {
        this.recordList.updatePagination(0);
    }
}
