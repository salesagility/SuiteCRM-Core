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
import {BehaviorSubject, Observable} from 'rxjs';
import {ColumnDefinition, RecordListMeta, SearchMeta} from 'common';
import {map, take, tap} from 'rxjs/operators';
import {RecordListStoreFactory} from '../../../../store/record-list/record-list.store.factory';
import {MetadataStore} from '../../../../store/metadata/metadata.store.service';
import {RecordList, RecordListStore} from '../../../../store/record-list/record-list.store';
import {StateStore} from '../../../../store/state';

@Injectable()
export class RecordListModalStore implements StateStore {

    recordList: RecordListStore;
    listMetadata$: Observable<RecordListMeta>;
    searchMetadata$: Observable<SearchMeta>;
    columns$: Observable<ColumnDefinition[]>;
    listMetadata: RecordListMeta;
    loading$: Observable<boolean>;
    metadataLoading$: Observable<boolean>;
    protected metadataLoadingState: BehaviorSubject<boolean>;

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected meta: MetadataStore,
    ) {
        this.recordList = listStoreFactory.create();
        this.loading$ = this.recordList.loading$;

        this.metadataLoadingState = new BehaviorSubject(false);
        this.metadataLoading$ = this.metadataLoadingState.asObservable();
    }

    clear(): void {
        this.recordList.clear();
        this.recordList = null;
    }

    clearAuthBased(): void {
        this.recordList.clearAuthBased();
    }

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module name
     */
    public init(module: string): void {

        this.metadataLoadingState.next(true);
        const meta$ = this.meta.getMetadata(module).pipe(
            tap(() => {
                this.metadataLoadingState.next(false);
                this.recordList.load().pipe(
                    take(1)
                ).subscribe();
            })
        );
        this.listMetadata$ = meta$.pipe(map(meta => meta.listView));
        this.searchMetadata$ = meta$.pipe(map(meta => meta.search));
        this.recordList.init(module, false, 'list_max_entries_per_subpanel');
        this.columns$ = this.listMetadata$.pipe(map(metadata => metadata.fields));
    }


    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    public load(useCache = true): Observable<RecordList> {

        return this.recordList.load(useCache);
    }
}
