/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2024 SalesAgility Ltd.
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

import {Injectable} from "@angular/core";
import {Pagination, PaginationType, Record, ObjectMap, emptyObject} from 'common';
import {AppStateStore} from "../../../../store/app-state/app-state.store";
import {UserPreferenceStore} from "../../../../store/user-preference/user-preference.store";
import {LocalStorageService} from "../../../../services/local-storage/local-storage.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {toNumber} from "lodash-es";

@Injectable({
    providedIn: 'root'
})
export class VcrService {

    private nextRecordSubject = new BehaviorSubject<boolean>(false);
    nextRecord$ = this.nextRecordSubject.asObservable();

    offset: number = 0;
    recordIds: any[] = [];
    pagination: Pagination;
    paginationType: string = PaginationType.PAGINATION;
    protected subs: Subscription[] = [];

    constructor(
        protected localStorageService: LocalStorageService,
        protected preferences: UserPreferenceStore,
        protected appStateStore: AppStateStore,
        protected route: ActivatedRoute,
    ) {
        this.subs.push(this.route.queryParamMap
            .subscribe((params: any) => {
                this.offset = toNumber(params.get('offset'));
            })
        );
    }

    public triggerNextRecord(value: boolean): void {
        this.nextRecordSubject.next(value);
    }

    public updateRecordListLocalStorage(records: Record[], pagination: Pagination): void {
        const module = this.getModule();
        const vcrObj = {
            pagination: pagination,
            recordIds: this.setRecordIds(records)
        };
        this.updatePaginationLocalStorage(pagination);
        this.savePreference(module, 'current-vcr', vcrObj);
    }

    public updatePaginationLocalStorage(pagination: Pagination): void {
        const module = this.getModule();
        const key = module + '-' + 'listview-current-pagination';
        this.localStorageService.set(key, pagination);
    }

    protected savePreference(module: string, storageKey: string, value: any): void {
        this.preferences.setUi(module, this.getPreferenceKey(storageKey), value);
    }

    protected getPreferenceKey(storageKey: string): string {
        return 'recordview-' + storageKey;
    }

    public setRecordIds(records: Record[]): ObjectMap[] {
        const recordIds = [];
        records.forEach(record => {
            recordIds.push({
                id: record.id
            })
        });
        return recordIds;
    }

    public getModule(): string {
        return this.appStateStore.getModule();
    }

    public getTotalRecords(): number {
        const key = this.getModule() + '-' + 'listview-current-pagination';
        const currentPagination = this.localStorageService.get(key) as Pagination;
        return currentPagination?.total;
    }

    public checkRecordValid(recordId: string): boolean {
        this.loadVcrData(this.getModule());
        if (!this.pagination) {
            return false;
        }

        const pageSize = this.getPageSize();

        if (this.offset > pageSize) {
            return false;
        }

        let index = (this.offset - 1) % pageSize;
        if (this.paginationType === PaginationType.LOAD_MORE) {
            index = this.offset  - 1;
        }
        if (index >= 0 && index < this.recordIds.length) {

            return this.recordIds[index]?.id === recordId;
        }

        return false;
    }

    public getPageSize(): number {
        return this.pagination?.pageSize;
    }

    protected loadVcrData(module: string): void {
        const key = module + '-' + 'recordview-current-vcr';
        const currentVcr = this.localStorageService.get(key)[module];
        if (!currentVcr || emptyObject(currentVcr)) {
            return;
        }
        this.pagination = currentVcr.pagination;
        this.recordIds = currentVcr.recordIds;
    }
}
