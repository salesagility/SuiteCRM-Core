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

import {deepClone} from 'common';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, take} from 'rxjs/operators';
import {StateStore} from 'core';
import {AppStateStore} from 'core';
import {Injectable} from '@angular/core';
import {FilterDataSource} from '@components/list-filter/list-filter.component';
import {BulkActionDataSource} from '@components/bulk-action-menu/bulk-action-menu.component';
import {SelectionStatus} from 'common';
import {AppData, ViewStore} from 'core';
import {LanguageStore} from 'core';
import {NavigationStore} from 'core';
import {ModuleNavigation} from 'core';
import {Metadata, MetadataStore} from 'core';
import {LocalStorageService} from 'core';
import {AsyncActionInput, AsyncActionService} from 'core';
import {MessageService} from 'core';
import {Process} from 'core';
import {Record} from 'common';
import {SearchCriteria} from 'common';
import {RecordList, RecordListStore} from 'core';
import {ColumnDefinition, ListViewMeta} from 'common';
import {BulkActionsMap} from 'common';
import {LineAction} from 'common';
import {Pagination, SortingSelection} from 'common';
import {RecordSelection} from 'common';
import {RecordListStoreFactory} from 'core';
import {ViewContext} from 'common';

export interface ListViewData {
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    selection?: RecordSelection;
    loading: boolean;
}

export interface ListViewModel {
    data: ListViewData;
    appData: AppData;
    metadata: Metadata;
}

const initialState: ListViewState = {
    module: '',
    widgets: true,
    displayFilters: false,
    showSidebarWidgets: false
};

export interface ListViewState {
    module: string;
    widgets: boolean;
    showSidebarWidgets: boolean;
    displayFilters: boolean;
}

@Injectable()
export class ListViewStore extends ViewStore implements StateStore,
    BulkActionDataSource,
    FilterDataSource {

    /**
     * Public long-lived observable streams
     */
    moduleName$: Observable<string>;
    columns$: Observable<ColumnDefinition[]>;
    lineActions$: Observable<LineAction[]>;
    records$: Observable<Record[]>;
    criteria$: Observable<SearchCriteria>;
    context$: Observable<ViewContext>;
    sort$: Observable<SortingSelection>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;
    showSidebarWidgets$: Observable<boolean>;
    displayFilters$: Observable<boolean>;
    recordList: RecordListStore;

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<ListViewModel>;
    vm: ListViewModel;
    data: ListViewData;

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    protected internalState: ListViewState = deepClone(initialState);
    protected store = new BehaviorSubject<ListViewState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected subs: Subscription[] = [];

    constructor(
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected bulkAction: AsyncActionService,
        protected message: MessageService,
        protected listStoreFactory: RecordListStoreFactory
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.recordList = this.listStoreFactory.create();

        this.columns$ = metadataStore.listViewColumns$;
        this.lineActions$ = metadataStore.listViewLineActions$;
        this.records$ = this.recordList.records$;
        this.criteria$ = this.recordList.criteria$;
        this.context$ = this.recordList.criteria$.pipe(map(() => this.getViewContext()));
        this.sort$ = this.recordList.sort$;
        this.pagination$ = this.recordList.pagination$;
        this.selection$ = this.recordList.selection$;
        this.selectedCount$ = this.recordList.selectedCount$;
        this.selectedStatus$ = this.recordList.selectedStatus$;
        this.loading$ = this.recordList.loading$;
        this.moduleName$ = this.state$.pipe(map(state => state.module), distinctUntilChanged());
        this.widgets$ = this.state$.pipe(map(state => state.widgets), distinctUntilChanged());
        this.showSidebarWidgets$ = this.state$.pipe(map(state => state.showSidebarWidgets));
        this.displayFilters$ = this.state$.pipe(map(state => state.displayFilters), distinctUntilChanged());

        const data$ = combineLatest(
            [this.records$, this.criteria$, this.pagination$, this.selection$, this.loading$]
        ).pipe(
            map(([records, criteria, pagination, selection, loading]) => {
                this.data = {records, criteria, pagination, selection, loading} as ListViewData;
                return this.data;
            })
        );

        this.vm$ = combineLatest([data$, this.appData$, this.metadata$]).pipe(
            map(([data, appData, metadata]) => {
                this.vm = {data, appData, metadata} as ListViewModel;
                return this.vm;
            }));

        this.subs.push(this.recordList.loading$.subscribe(
            (loading: boolean) => {
                this.appStateStore.updateLoading(`${this.internalState.module}-list-fetch`, loading);
            },
            () => {
                this.appStateStore.updateLoading(`${this.internalState.module}-list-fetch`, false);
            }
        ));
    }

    get showFilters(): boolean {
        return this.internalState.displayFilters;
    }

    set showFilters(show: boolean) {
        this.updateState({
            ...this.internalState,
            displayFilters: show
        });
    }

    get widgets(): boolean {
        return this.internalState.widgets;
    }

    set widgets(show: boolean) {
        this.updateState({
            ...this.internalState,
            widgets: show
        });
    }

    get showSidebarWidgets(): boolean {
        return this.internalState.showSidebarWidgets;
    }

    set showSidebarWidgets(show: boolean) {
        this.updateState({
            ...this.internalState,
            showSidebarWidgets: show
        });
    }

    getModuleName(): string {
        return this.internalState.module;
    }

    getViewContext(): ViewContext {

        const context = {
            module: this.getModuleName(),
        } as ViewContext;

        context.criteria = this.recordList.criteria;
        context.sort = this.recordList.sort;

        return context;
    }

    /**
     * Clean destroy
     */
    public destroy(): void {
        this.clear();
        this.subs.forEach(sub => sub.unsubscribe());
    }

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @returns {object} Observable<any>
     */
    public init(module: string): Observable<RecordList> {
        this.internalState.module = module;
        this.recordList.init(module, false);

        this.calculateShowWidgets();

        this.storageLoad(module, 'search-criteria', (storage) => this.recordList.criteria = storage);
        this.storageLoad(module, 'sort-selection', (storage) => this.recordList.sort = storage);

        return this.load();
    }

    /**
     * Clear observable cache
     */
    public clear(): void {
        this.cache$ = null;
        this.updateState(deepClone(initialState));
        this.recordList.clear();
    }

    public clearAuthBased(): void {
        this.clear();
        this.recordList.clearAuthBased();
    }

    /**
     * Bulk action public API
     */

    getBulkActions(): Observable<BulkActionsMap> {
        return this.metadata$.pipe(
            map((metadata: Metadata) => metadata.listView.bulkActions)
        );
    }

    public getFilter(): any {
        return deepClone(this.metadata.listView.filters || []);
    }

    public executeBulkAction(action: string): void {
        const selection = this.recordList.selection;
        const definition = this.metadata.listView.bulkActions[action];
        const actionName = `bulk-${action}`;

        this.message.removeMessages();

        if (definition.params.min && selection.count < definition.params.min) {
            let message = this.appStrings.LBL_TOO_FEW_SELECTED;
            message = message.replace('{min}', definition.params.min);
            this.message.addDangerMessage(message);
            return;
        }

        if (definition.params.max && selection.count > definition.params.max) {
            let message = this.appStrings.LBL_TOO_MANY_SELECTED;
            message = message.replace('{max}', definition.params.max);
            this.message.addDangerMessage(message);
            return;
        }

        const displayedFields = [];

        this.metadata.listView.fields.forEach(value => {
            displayedFields.push(value.name);
        });

        const data = {
            action: actionName,
            module: this.internalState.module,
            criteria: null,
            sort: null,
            ids: null,
            fields: displayedFields
        } as AsyncActionInput;


        if (selection.all && selection.count > this.recordList.records.length) {
            data.criteria = this.recordList.criteria;
            data.sort = this.recordList.sort;
        }

        if (selection.all && selection.count <= this.recordList.records.length) {
            data.ids = [];
            this.recordList.records.forEach(record => {
                data.ids.push(record.id);
            });
        }

        if (!selection.all) {
            data.ids = Object.keys(selection.selected);
        }

        this.bulkAction.run(actionName, data).subscribe((process: Process) => {
            if (process.data && process.data.reload) {
                this.recordList.clearSelection();
                this.load(false).pipe(take(1)).subscribe();
            }
        });
    }

    /**
     * Update the search criteria
     *
     * @param {object} criteria to set
     * @param {boolean} reload flag
     */
    public updateSearchCriteria(criteria: SearchCriteria, reload = true): void {
        this.recordList.updateSearchCriteria(criteria, reload);
        if (reload) {
            this.updateLocalStorage();
        }
    }

    public updateLocalStorage(): void {
        this.storageSave(this.internalState.module, 'search-criteria', this.recordList.criteria);
        this.storageSave(this.internalState.module, 'sort-selection', this.recordList.sort);
    }

    /**
     * Internal API
     */

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: ListViewState): void {
        this.store.next(this.internalState = state);
    }

    /**
     * Calculate if widgets are to display
     */
    protected calculateShowWidgets(): void {
        let show = false;

        const meta = this.metadataStore.get() || {};
        const listViewMeta = meta.listView || {} as ListViewMeta;
        const sidebarWidgetsConfig = listViewMeta.sidebarWidgets || [];

        if (sidebarWidgetsConfig && sidebarWidgetsConfig.length > 0) {
            show = true;
        }

        this.showSidebarWidgets = show;
        this.widgets = show;
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    protected load(useCache = true): Observable<RecordList> {

        this.storageSave(this.internalState.module, 'search-criteria', this.recordList.criteria);
        this.storageSave(this.internalState.module, 'sort-selection', this.recordList.sort);

        return this.recordList.load(useCache);
    }

    /**
     * Store the data in local storage
     *
     * @param {string} module to store in
     * @param {string} storageKey to store in
     * @param {any} data to store
     */
    protected storageSave(module: string, storageKey: string, data: any): void {
        let storage = this.localStorage.get(storageKey);

        if (!storage) {
            storage = {};
        }

        storage[module] = data;

        this.localStorage.set(storageKey, storage);
    }

    /**
     * Store the key in local storage
     *
     * @param {string} module to load from
     * @param {string} storageKey from load from
     * @param {Function} loader to store in
     */
    protected storageLoad(module: string, storageKey: string, loader: Function): void {
        const storage = this.localStorage.get(storageKey);

        if (!storage || !storage[module]) {
            return;
        }

        loader(storage[module]);
    }
}
