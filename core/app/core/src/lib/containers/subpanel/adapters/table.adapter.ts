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

import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {ActionDataSource, ColumnDefinition, SortDirection, SortingSelection} from 'common';
import {map} from 'rxjs/operators';
import {TableConfig} from '../../../components/table/table.model';
import {SubpanelStore} from '../store/subpanel/subpanel.store';
import {SubpanelLineActionsAdapterFactory} from './line-actions.adapter.factory';
import {UserPreferenceStore} from '../../../store/user-preference/user-preference.store';
import {SystemConfigStore} from "../../../store/system-config/system-config.store";
import {RecordListModalStore} from "../../record-list-modal/store/record-list-modal/record-list-modal.store";

@Injectable()
export class SubpanelTableAdapter {

    constructor(
        protected store: SubpanelStore,
        protected lineActionsAdapterFactory: SubpanelLineActionsAdapterFactory,
        protected preferences: UserPreferenceStore,
        protected systemConfigs: SystemConfigStore
    ) {
    }

    getTable(): TableConfig {
        return {
            showHeader: false,
            showFooter: true,

            module: this.store.metadata.headerModule,

            columns: this.getColumns(),
            lineActions: this.getLineActions(),
            sort$: this.store.recordList.sort$,
            maxColumns$: of(5),
            loading$: this.store.recordList.loading$,

            dataSource: this.store.recordList,
            pagination: this.store.recordList,

            toggleRecordSelection: (id: string): void => {
                this.store.recordList.toggleSelection(id);
            },

            updateSorting: (orderBy: string, sortOrder: SortDirection): void => {
                this.store.recordList.updateSorting(orderBy, sortOrder);

                const parentModule = this.store.parentModule;
                const module = this.store.recordList.getModule();
                const sort = {orderBy, sortOrder} as SortingSelection;

                const jump = this.systemConfigs.getConfigValue('list_max_entries_per_subpanel');
                this.store.recordList.setPageSize(jump);
                this.store.recordList.updatePagination(0);
                this.preferences.setUi(parentModule, module + '-subpanel-sort', sort);
            },

            jump: this.systemConfigs.getConfigValue('list_max_entries_per_subpanel'),

            paginationType: this.systemConfigs.getConfigValue('subpanel_pagination_type'),

            loadMore: (jump: number): void => {
                const pagination = this.store.recordList.getPagination();
                const currentPageSize = pagination.pageSize || 0;
                const newPageSize = Number(currentPageSize) + Number(jump);


                this.store.recordList.setPageSize(newPageSize);
                this.store.recordList.updatePagination(0);
            },

            allLoaded: (): boolean => {
                const pagination = this.store.recordList.getPagination();
                if (!pagination) {
                    return false;
                }
                if (pagination.pageLast >= pagination.total) {
                    return true;
                }
                return pagination.pageSize >= pagination.total;
            }

        } as TableConfig;
    }

    protected getColumns(): Observable<ColumnDefinition[]> {
        return this.store.metadata$.pipe(map(metadata => metadata.columns));
    }

    protected getLineActions(): ActionDataSource {
        return this.lineActionsAdapterFactory.create(this.store);
    }
}
