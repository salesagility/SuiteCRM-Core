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

import {
    Action,
    ColumnDefinition,
    deepClone,
    ListViewMeta,
    Pagination,
    Record,
    RecordSelection,
    SearchCriteria,
    SelectionStatus,
    SortingSelection,
    ViewContext
} from 'common';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {NavigationStore} from '../../../../store/navigation/navigation.store';
import {RecordList, RecordListStore} from '../../../../store/record-list/record-list.store';
import {Metadata, MetadataStore} from '../../../../store/metadata/metadata.store.service';
import {StateStore} from '../../../../store/state';
import {LanguageStore} from '../../../../store/language/language.store';
import {ModuleNavigation} from '../../../../services/navigation/module-navigation/module-navigation.service';
import {MessageService} from '../../../../services/message/message.service';
import {RecordListStoreFactory} from '../../../../store/record-list/record-list.store.factory';
import {AppStateStore} from '../../../../store/app-state/app-state.store';
import {AppData, ViewStore} from '../../../../store/view/view.store';
import {LocalStorageService} from '../../../../services/local-storage/local-storage.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ColumnChooserComponent} from "../../../../components/columnchooser/columnchooser.component";
import {SavedFilter, SavedFilterMap} from '../../../../store/saved-filters/saved-filter.model';
import {FilterListStore} from '../../../../store/saved-filters/filter-list.store';
import {FilterListStoreFactory} from '../../../../store/saved-filters/filter-list.store.factory';
import {ConfirmationModalService} from '../../../../services/modals/confirmation-modal.service';
import {RecordPanelMetadata} from '../../../../containers/record-panel/store/record-panel/record-panel.store.model';

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

const initialFilter: SavedFilter = {
    key: 'default',
    module: 'saved-search',
    attributes: {
        contents: ''
    },
    criteria: {
        name: 'default',
        filters: {}
    }
};

const initialFilters: SavedFilterMap = {
    'default': deepClone(initialFilter)
};

const initialState: ListViewState = {
    module: '',
    widgets: true,
    actionPanel: '',
    showSidebarWidgets: false,
    recordPanelConfig: {} as RecordPanelMetadata,
    activeFilters: deepClone(initialFilters),
    openFilter: deepClone(initialFilter)
};

export interface ListViewState {
    module: string;
    widgets: boolean;
    actionPanel: string;
    showSidebarWidgets: boolean;
    recordPanelConfig: RecordPanelMetadata;
    activeFilters: SavedFilterMap;
    openFilter: SavedFilter;
}

@Injectable()
export class ListViewStore extends ViewStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    moduleName$: Observable<string>;
    columns: BehaviorSubject<ColumnDefinition[]>;
    columns$: Observable<ColumnDefinition[]>;
    lineActions$: Observable<Action[]>;
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
    actionPanel$: Observable<string>;
    recordList: RecordListStore;
    dataUpdate$: Observable<boolean>;
    dataSetUpdate$: Observable<boolean>;
    activeFilters$: Observable<SavedFilterMap>;
    openFilter$: Observable<SavedFilter>;
    filterList: FilterListStore;

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
    protected dataUpdateState: BehaviorSubject<boolean>;
    protected subs: Subscription[] = [];

    constructor(
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected message: MessageService,
        protected listStoreFactory: RecordListStoreFactory,
        protected modalService: NgbModal,
        protected filterListStoreFactory: FilterListStoreFactory,
        protected confirmation: ConfirmationModalService,
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
        this.displayFilters$ = this.state$.pipe(map(state => state.actionPanel === 'filters'), distinctUntilChanged());
        this.actionPanel$ = this.state$.pipe(map(state => state.actionPanel), distinctUntilChanged());
        this.activeFilters$ = this.state$.pipe(map(state => state.activeFilters), distinctUntilChanged());
        this.openFilter$ = this.state$.pipe(map(state => state.openFilter), distinctUntilChanged());

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

        let listViewColumns: ColumnDefinition[] = [];
        this.subs.push(metadataStore.listViewColumns$.subscribe(cols => {
            listViewColumns = cols;
        }));

        this.columns = new BehaviorSubject<ColumnDefinition[]>(listViewColumns);
        this.columns$ = this.columns.asObservable();

        this.initDataUpdateState();
        this.initDataSetUpdatedState();

        this.filterList = this.filterListStoreFactory.create();
    }

    get actionPanel(): string {
        return this.internalState.actionPanel;
    }

    get showFilters(): boolean {
        return this.internalState.actionPanel === 'filters';
    }

    set showFilters(show: boolean) {

        this.updateState({
            ...this.internalState,
            actionPanel: show ? 'filters' : ''
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

    get recordPanelConfig(): RecordPanelMetadata {
        return this.internalState.recordPanelConfig;
    }

    isRecordPanelOpen(): boolean {
        return this.internalState.actionPanel === 'recordPanel';
    }

    openRecordPanel(config: RecordPanelMetadata): void {
        this.updateState({
            ...this.internalState,
            actionPanel: 'recordPanel',
            recordPanelConfig: config
        });
    }

    closeRecordPanel(): void {
        this.updateState({
            ...this.internalState,
            actionPanel: '',
            recordPanelConfig: {} as RecordPanelMetadata
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
     * get active filters
     *
     * @returns {object} active filters
     */
    get activeFilters(): SavedFilterMap {
        return deepClone(this.internalState.activeFilters);
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
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @returns {object} Observable<any>
     */
    public init(module: string): Observable<RecordList> {
        this.internalState.module = module;
        this.recordList.init(module, false);
        this.filterList.init(module);

        this.filterList.load(false).pipe(take(1)).subscribe();

        this.calculateShowWidgets();

        this.storageLoad(module, 'active-filters', (storage) => this.setFilters(storage, false));
        this.storageLoad(module, 'sort-selection', (storage) => this.recordList.sort = storage);

        return this.load();
    }

    /**
     * Set open filters
     *
     * @param {object} filter to set
     */
    public setOpenFilter(filter: SavedFilter): void {
        this.updateState({...this.internalState, openFilter: deepClone(filter)});
    }

    /**
     * Set active filters
     *
     * @param {object} filters to set
     * @param {boolean} reload flag
     */
    public setFilters(filters: SavedFilterMap, reload = true): void {

        const filterKey = Object.keys(filters).shift();
        const filter = filters[filterKey];

        this.updateState({...this.internalState, activeFilters: deepClone(filters), openFilter: deepClone(filter)});

        if (filter.criteria) {
            const orderBy = filter.criteria.orderBy ?? '';
            const sortOrder = filter.criteria.sortOrder ?? '';
            let direction = this.recordList.mapSortOrder(sortOrder);

            this.recordList.updateSorting(orderBy, direction, false);
            this.updateLocalStorage();
        }

        this.updateSearchCriteria(reload)
    }

    /**
     * Update filters
     *
     * @param {object} filter to set
     */
    public addSavedFilter(filter: SavedFilter): void {

        const newState = {...this.internalState};
        const activeFilters = this.activeFilters;

        if (filter.key && activeFilters[filter.key]) {
            activeFilters[filter.key] = filter;
            newState.activeFilters = activeFilters;
        }

        newState.openFilter = filter;

        this.filterList.addFilter(filter);

        this.updateState(newState);
    }

    /**
     * Update filters
     *
     * @param {object} filter to set
     */
    public removeSavedFilter(filter: SavedFilter): void {

        if (!filter || !filter.key) {
            return;
        }

        this.filterList.removeFilter(filter);

        const newState = {...this.internalState};

        if (newState.openFilter && newState.openFilter.key === filter.key) {
            this.resetFilters(true)
        }
    }

    /**
     * Reset active filters
     *
     * @param {boolean} reload flag
     */
    public resetFilters(reload = true): void {

        this.updateState({
            ...this.internalState,
            activeFilters: deepClone(initialFilters),
            openFilter: deepClone(initialFilter)
        });

        this.updateSearchCriteria(reload)
    }

    /**
     * Update the search criteria
     *
     * @param {boolean} reload flag
     */
    public updateSearchCriteria(reload = true): void {

        const filters = {...this.internalState.activeFilters};
        const filterKey = Object.keys(filters).shift();
        const filter = filters[filterKey];

        this.recordList.updateSearchCriteria(filter.criteria, reload);
        if (reload) {
            this.updateLocalStorage();
        }
    }

    public updateLocalStorage(): void {
        this.storageSave(this.internalState.module, 'active-filters', this.internalState.activeFilters);
        this.storageSave(this.internalState.module, 'sort-selection', this.recordList.sort);
    }

    public triggerDataUpdate(): void {
        this.dataUpdateState.next(true);
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    public load(useCache = true): Observable<RecordList> {

        this.storageSave(this.internalState.module, 'active-filters', this.internalState.activeFilters);
        this.storageSave(this.internalState.module, 'sort-selection', this.recordList.sort);

        return this.recordList.load(useCache);
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
     * Store the data in local storage
     *
     * @param {string} module to store in
     * @param {string} storageKey to store in
     * @param {} data to store
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

    openColumnChooserDialog(): void {

        const modalRef = this.modalService.open(ColumnChooserComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg',
            windowClass: 'column-chooser-modal'
        });

        const displayedColumns = this.columns.getValue().filter(function (col) {
            return !col.hasOwnProperty('default')
                || (col.hasOwnProperty('default') && col.default === true);
        });

        const hiddenColumns = this.columns.getValue().filter(function (col) {
            return col.hasOwnProperty('default') && col.default === false;
        });

        modalRef.componentInstance.displayed = displayedColumns;
        modalRef.componentInstance.hidden = hiddenColumns;

        modalRef.result.then((result) => {

            let allColumns: ColumnDefinition[] = [];
            const selectedDisplayColumns: ColumnDefinition[] = result.displayed;
            const selectedHideColumns: ColumnDefinition[] = result.hidden;

            selectedDisplayColumns.forEach(function (column) {
                column.default = true;
            });
            selectedHideColumns.forEach(function (column) {
                column.default = false;
            });
            allColumns.push(...selectedDisplayColumns, ...selectedHideColumns);
            this.columns.next(allColumns);
        });
    }


    /**
     * Initialize data update state.
     * It should be emitted on any change in values on the record list.
     * Reload/Pagination is not considered as a data update
     */
    protected initDataUpdateState(): void {
        this.dataUpdateState = new BehaviorSubject<boolean>(true);
        this.dataUpdate$ = this.dataUpdateState.asObservable();
    }

    /**
     *  Initialize the dataSet update state.
     *  It should be emitted on any change in dataSet e.g. due to data filter, due to data delete,
     *  due to data edit or any event which causes change in the resulting dataSet.
     */
    protected initDataSetUpdatedState(): void {
        this.dataSetUpdate$ = combineLatest(
            [this.criteria$, this.dataUpdate$]
        ).pipe(map(() => true));
    }
}
