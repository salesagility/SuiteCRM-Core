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
import {Pagination, Record, ObjectMap} from 'common';
import {AppStateStore} from "../../../../store/app-state/app-state.store";
import {UserPreferenceStore} from "../../../../store/user-preference/user-preference.store";
import {LocalStorageService} from "../../../../services/local-storage/local-storage.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VcrService {

    private nextRecordSubject = new BehaviorSubject<boolean>(false);
    nextRecord$ = this.nextRecordSubject.asObservable();

    constructor(
        protected appStateStore: AppStateStore,
        protected preferences: UserPreferenceStore,
        protected localStorageService: LocalStorageService
    ) {}

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
}
