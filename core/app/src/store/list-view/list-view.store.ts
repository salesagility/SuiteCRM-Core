import {deepClone} from '@base/utils/object-utils';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, take, tap} from 'rxjs/operators';
import {StateStore} from '@store/state';
import {AppStateStore} from '@store/app-state/app-state.store';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';
import {
    FilterDataSource
} from '@components/list-filter/list-filter.component';
import {
    BulkActionDataSource,
    SelectionDataSource,
    SelectionStatus
} from '@components/bulk-action-menu/bulk-action-menu.component';
import {ChartTypesDataSource} from '@components/chart/chart.component';
import {ListGQL} from '@store/list-view/api.list.get';
import {PageSelection, PaginationCount, PaginationDataSource} from '@components/pagination/pagination.model';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {AppData, ViewStore} from '@store/view/view.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {BulkActionsMap, Metadata, MetadataStore} from '@store/metadata/metadata.store.service';
import {LocalStorageService} from '@services/local-storage/local-storage.service';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {BulkActionProcess, BulkActionProcessInput} from '@services/process/processes/bulk-action/bulk-action';
import {MessageService} from '@services/message/message.service';
import {Process} from '@services/process/process.service';

export interface FieldMap {
    [key: string]: any;
}

export interface Record {
    type: string;
    module: string;
    attributes: FieldMap;
    id?: string;
}

export interface SearchCriteriaFieldFilter {
    field?: string;
    operator: string;
    values?: string[];
    start?: string;
    end?: string;
}

export interface SearchCriteriaFilter {
    [key: string]: SearchCriteriaFieldFilter;
}

export interface SearchCriteria {
    name?: string;
    type?: string;
    filters: SearchCriteriaFilter;
}

const initialSearchCriteria = {
    filters: {}
};

export interface SortingSelection {
    orderBy?: string;
    sortOrder?: SortDirection;
}

const initialListSort = {
    orderBy: 'date_entered',
    sortOrder: SortDirection.DESC
};

export interface Pagination {
    pageSize: number;
    current: number;
    previous: number;
    next: number;
    last: number;
    pageFirst: number;
    pageLast: number;
    total: number;
}

export interface RecordSelection {
    all: boolean;
    status: SelectionStatus;
    selected: { [key: string]: string };
    count: number;
}

const initialSelection: RecordSelection = {
    all: false,
    status: SelectionStatus.NONE,
    selected: {},
    count: 0
};

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

export interface ListData {
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
}

const initialState: ListViewState = {
    module: '',
    records: [],
    criteria: deepClone(initialSearchCriteria),
    sort: deepClone(initialListSort),
    pagination: {
        pageSize: 5,
        current: 0,
        previous: 0,
        next: 5,
        last: 0,
        total: 0,
        pageFirst: 0,
        pageLast: 0
    },
    selection: deepClone(initialSelection),
    loading: false,
    widgets: true
};

export interface ListViewState {
    module: string;
    records: Record[];
    criteria: SearchCriteria;
    sort: SortingSelection;
    pagination: Pagination;
    selection: RecordSelection;
    loading: boolean;
    widgets: boolean;
}

@Injectable()
export class ListViewStore extends ViewStore
    implements StateStore, DataSource<Record>, SelectionDataSource, PaginationDataSource, BulkActionDataSource, ChartTypesDataSource, FilterDataSource {

    /**
     * Public long-lived observable streams
     */
    records$: Observable<Record[]>;
    criteria$: Observable<SearchCriteria>;
    sort$: Observable<SortingSelection>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<ListViewModel>;
    vm: ListViewModel;
    data: ListViewData;

    protected displayFilters = false;

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    protected internalState: ListViewState = deepClone(initialState);
    protected store = new BehaviorSubject<ListViewState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'meta',
            'records'
        ]
    };
    protected preferencesSub: Subscription;

    constructor(
        protected listGQL: ListGQL,
        protected configStore: SystemConfigStore,
        protected preferencesStore: UserPreferenceStore,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected bulkAction: BulkActionProcess,
        protected message: MessageService,
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
        this.sort$ = this.state$.pipe(map(state => state.sort), distinctUntilChanged());
        this.pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
        this.selection$ = this.state$.pipe(map(state => state.selection), distinctUntilChanged());
        this.selectedCount$ = this.state$.pipe(map(state => state.selection.count), distinctUntilChanged());
        this.selectedStatus$ = this.state$.pipe(map(state => state.selection.status), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
        this.widgets$ = this.state$.pipe(map(state => state.widgets));

        this.watchPageSize(configStore, preferencesStore);

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
    }

    connect(): Observable<any> {
        return this.records$;
    }

    disconnect(): void {
        this.destroy();
    }

    get showFilters(): boolean {
        return this.displayFilters;
    }

    set showFilters(show: boolean) {
        this.displayFilters = show;
    }

    get showWidgets(): boolean {
        return this.internalState.widgets;
    }

    set showWidgets(show: boolean) {
        this.updateState({
            ...this.internalState,
            widgets: show
        });
    }

    get searchCriteria(): SearchCriteria {
        if (!this.internalState.criteria) {
            return deepClone(initialSearchCriteria);
        }

        return this.internalState.criteria;
    }

    /**
     * Clean destroy
     */
    public destroy(): void {
        this.clear();
    }

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @returns {object} Observable<any>
     */
    public init(module: string): Observable<ListViewState> {
        this.internalState.module = module;

        this.storageLoad(module, 'search-criteria', 'criteria');
        this.storageLoad(module, 'sort-selection', 'sort');
        this.initSearchCriteria();

        return this.load();
    }

    /**
     * Init search criteria
     */
    public initSearchCriteria(): void {
        let criteria = this.internalState.criteria;

        if (!this.internalState.criteria) {
            criteria = deepClone(initialSearchCriteria);
        }

        const metadata = this.metadataStore.get();

        if (metadata.search && metadata.search.layout){
            const searchMeta = metadata.search;

            if (!searchMeta.layout.advanced) {
                criteria.type = 'basic';
            }
        }

        this.updateState({
            ...this.internalState,
            criteria
        });
    }

    /**
     * Update the search criteria
     *
     * @param {object} criteria to set
     * @param {boolean} reload flag
     */
    public updateSearchCriteria(criteria: SearchCriteria, reload = true): void {
        this.updateState({...this.internalState, criteria});

        if (reload) {
            this.updateSelection(SelectionStatus.NONE);
            this.load(false).pipe(take(1)).subscribe();
        }
    }

    /**
     * Update current list view sorting
     *
     * @param {string} orderBy to set
     * @param {string} sortOrder to set
     * @param {boolean} reload flag
     */
    updateSorting(orderBy: string, sortOrder: SortDirection, reload = true): void {

        if (sortOrder === SortDirection.NONE) {
            orderBy = 'date_entered';
            sortOrder = SortDirection.DESC;
        }

        const sort = {orderBy, sortOrder} as SortingSelection;

        this.updateState({...this.internalState, sort});

        if (reload) {
            this.load(false).pipe(take(1)).subscribe();
        }
    }

    /**
     * Update the pagination
     *
     * @param {number} current to set
     */
    public updatePagination(current: number): void {
        const pagination = {...this.internalState.pagination, current};
        this.updateState({...this.internalState, pagination});

        this.load(false).pipe(take(1)).subscribe();
    }

    /**
     * Clear observable cache
     */
    public clear(): void {
        this.cache$ = null;
        this.updateState(deepClone(initialState));
        this.preferencesSub.unsubscribe();
    }

    public clearAuthBased(): void {
        this.clear();
    }

    /**
     * Selection public api
     */

    getSelectionStatus(): Observable<SelectionStatus> {
        return this.selectedStatus$;
    }

    getSelectedCount(): Observable<number> {
        return this.selectedCount$;
    }

    updateSelection(state: SelectionStatus): void {
        if (state === SelectionStatus.NONE) {
            this.clearSelection();
            return;
        }

        if (state === SelectionStatus.ALL) {
            this.selectAll();
            return;
        }

        if (state === SelectionStatus.PAGE) {
            this.selectPage();
            return;
        }
    }

    clearSelection(): void {
        this.updateState({
            ...this.internalState,
            selection: deepClone(initialSelection)
        });
    }

    selectAll(): void {
        const total = this.internalState.pagination.total;
        this.updateState({
            ...this.internalState,
            selection: {
                all: true,
                status: SelectionStatus.ALL,
                selected: {},
                count: total
            }
        });
    }

    selectPage(): void {
        const selected = {...this.internalState.selection.selected};

        if (this.internalState.records && this.internalState.records.length) {
            this.internalState.records.forEach(value => {
                if (value && value.id) {
                    selected[value.id] = value.id;
                }
            });
        }

        this.updateState({
            ...this.internalState,
            selection: {
                all: false,
                status: SelectionStatus.SOME,
                selected,
                count: Object.keys(selected).length
            }
        });
    }

    toggleSelection(id: string): void {
        const selection = deepClone(this.internalState.selection);

        if (selection.selected[id]) {
            delete selection.selected[id];
        } else {
            selection.selected[id] = id;
        }

        selection.count = Object.keys(selection.selected).length;

        if (selection.count === 0) {
            selection.status = SelectionStatus.NONE;
        } else {
            selection.status = SelectionStatus.SOME;
        }

        this.updateState({
            ...this.internalState,
            selection
        });
    }

    /**
     * Bulk action public API
     */

    getBulkActions(): Observable<BulkActionsMap> {
        return this.metadata$.pipe(
            map((metadata: Metadata) => metadata.listView.bulkActions)
        );
    }

    public getChartTypes(): any {
        return this.metadata.listView.chartTypes;
    }

    public getFilter(): any {
        return this.metadata.listView.filters;
    }

    executeBulkAction(action: string): void {
        const selection = this.internalState.selection;
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
            displayedFields.push(value.fieldName);
        });

        const data = {
            action: actionName,
            module: this.internalState.module,
            criteria: null,
            sort: null,
            ids: null,
            fields: displayedFields
        } as BulkActionProcessInput;


        if (selection.all && selection.count > this.internalState.records.length) {
            data.criteria = this.internalState.criteria;
            data.sort = this.internalState.sort;
        }

        if (selection.all && selection.count <= this.internalState.records.length) {
            data.ids = [];
            this.internalState.records.forEach(record => {
                data.ids.push(record.id);
            });
        }

        if (!selection.all) {
            data.ids = Object.keys(selection.selected);
        }

        this.bulkAction.run(actionName, data).subscribe((process: Process) => {
            if (process.data && process.data.reload) {
                this.clearSelection();
                this.load(false).pipe(take(1)).subscribe();
            }
        });
    }

    /**
     * Pagination Public API
     */

    getPaginationCount(): Observable<PaginationCount> {
        return this.pagination$.pipe(map(pagination => ({
            pageFirst: pagination.pageFirst,
            pageLast: pagination.pageLast,
            total: pagination.total
        } as PaginationCount)), distinctUntilChanged());
    }

    getPagination(): Pagination {
        return this.store.value.pagination;
    }

    changePage(page: PageSelection): void {
        let pageToLoad = 0;

        const pageMap = {};
        pageMap[PageSelection.FIRST] = 0;
        pageMap[PageSelection.PREVIOUS] = this.internalState.pagination.previous;
        pageMap[PageSelection.NEXT] = this.internalState.pagination.next;
        pageMap[PageSelection.LAST] = this.internalState.pagination.last;

        if (page in pageMap && pageMap[page] >= 0) {
            pageToLoad = pageMap[page];
            this.updatePagination(pageToLoad);
        }
    }

    /**
     * Internal API
     */

    /**
     * Subscribe to page size changes
     *
     * @param {object} configStore to watch
     * @param {object} preferencesStore to watch
     */
    protected watchPageSize(configStore: SystemConfigStore, preferencesStore: UserPreferenceStore): void {

        const pageSizePreference = preferencesStore.getUserPreference('list_max_entries_per_page');
        const pageSizeConfig = configStore.getConfigValue('list_max_entries_per_page');
        this.determinePageSize(pageSizePreference, pageSizeConfig);

        this.preferencesSub = combineLatest([configStore.configs$, preferencesStore.userPreferences$])
            .pipe(
                tap(([configs, preferences]) => {
                    const key = 'list_max_entries_per_page';
                    const sizePreference = (preferences && preferences[key]) || null;
                    const sizeConfig = (configs && configs[key] && configs[key].value) || null;

                    this.determinePageSize(sizePreference, sizeConfig);

                })
            ).subscribe();
    }

    /**
     * Determine page size to use
     *
     * @param {any} pageSizePreference to use
     * @param {string} pageSizeConfig to use
     */
    protected determinePageSize(pageSizePreference: any, pageSizeConfig: string): void {
        let size = 0;

        if (pageSizePreference) {
            size = pageSizePreference;
        } else if (pageSizeConfig) {
            size = parseInt(pageSizeConfig, 10);
        }

        this.setPageSize(size);
    }

    /**
     * Set Pagination page size
     *
     * @param {number} pageSize to set
     */
    protected setPageSize(pageSize: number): void {
        const pagination = {...this.internalState.pagination, pageSize};
        this.updateState({...this.internalState, pagination});
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: ListViewState): void {
        this.store.next(this.internalState = state);
    }

    /**
     * Calculate page count
     *
     * @param {object} records list
     * @param {object} pagination info
     */
    protected calculatePageCount(records: Record[], pagination: Pagination): void {
        const recordCount = (records && records.length) || 0;
        let pageFirst = 0;
        let pageLast = 0;

        if (recordCount > 0) {
            pageFirst = pagination.current + 1;
            pageLast = pagination.current + recordCount;
        }
        pagination.pageFirst = pageFirst;
        pagination.pageLast = pageLast;
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    protected load(useCache = true): Observable<ListViewState> {
        this.appStateStore.updateLoading(`${this.internalState.module}-list-fetch`, true);

        return this.getRecords(
            this.internalState.module,
            this.internalState.criteria,
            this.internalState.sort,
            this.internalState.pagination,
            useCache
        ).pipe(
            tap((data: ListViewState) => {
                this.appStateStore.updateLoading(`${this.internalState.module}-list-fetch`, false);
                this.calculatePageCount(data.records, data.pagination);
                this.updateState({
                    ...this.internalState,
                    records: data.records,
                    pagination: data.pagination
                });
            })
        );
    }

    /**
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {object} criteria to use
     * @param {object} sort to use
     * @param {object} pagination to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    protected getRecords(
        module: string,
        criteria: SearchCriteria,
        sort: SortingSelection,
        pagination: Pagination,
        useCache = true
    ): Observable<ListViewState> {
        this.storageSave(module, 'search-criteria', criteria);
        this.storageSave(module, 'sort-selection', sort);

        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.fetch(module, criteria, sort, pagination).pipe(
                shareReplay(1)
            );
        }
        return this.cache$;
    }

    /**
     * Fetch the List records from the backend
     *
     * @param {string} module to use
     * @param {object} criteria to use
     * @param {object} sort to use
     * @param {object} pagination to use
     * @returns {object} Observable<any>
     */
    protected fetch(module: string, criteria: SearchCriteria, sort: SortingSelection, pagination: Pagination): Observable<ListData> {
        const mappedSort = this.mapSort(sort);

        return this.listGQL.fetch(module, pagination.pageSize, pagination.current, criteria, mappedSort, this.fieldsMetadata)
            .pipe(map(({data}) => {
                const recordsList: ListData = {
                    records: [],
                    pagination: {} as Pagination
                };

                if (!data || !data.getListView) {
                    return recordsList;
                }

                const listData = data.getListView;

                if (listData.records) {
                    listData.records.forEach((record: any) => {
                        recordsList.records.push(
                            record
                        );
                    });
                }

                if (!listData.meta) {
                    return recordsList;
                }

                if (listData.meta.offsets) {

                    const paginationFieldMap = {
                        current: 'current',
                        next: 'next',
                        prev: 'previous',
                        total: 'total',
                        end: 'last',
                    };

                    Object.keys(paginationFieldMap).forEach((key) => {
                        if (key in listData.meta.offsets) {
                            const paginationField = paginationFieldMap[key];
                            recordsList.pagination[paginationField] = listData.meta.offsets[key];
                        }
                    });
                }

                return recordsList;
            }));
    }

    protected mapSort(sort: SortingSelection): { [key: string]: string } {
        const sortOrderMap = {
            NONE: '',
            ASC: 'ASC',
            DESC: 'DESC'

        };

        return {
            sortOrder: sortOrderMap[sort.sortOrder],
            orderBy: sort.orderBy
        };
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
     * @param {string} stateKey to store in
     */
    protected storageLoad(module: string, storageKey: string, stateKey: string): void {
        const storage = this.localStorage.get(storageKey);

        if (!storage || !storage[module]) {
            return;
        }

        const newState = {...this.internalState};
        newState[stateKey] = storage[module];

        this.updateState(newState);
    }
}
