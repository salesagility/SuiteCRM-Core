import {deepClone} from '@base/utils/object-utils';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, take, tap} from 'rxjs/operators';
import {StateStore} from '@store/state';
import {AppStateStore} from '@store/app-state/app-state.store';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';
import {SelectionDataSource, SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {ListGQL} from '@store/list-view/api.list.get';
import {PageSelection, PaginationCount, PaginationDataSource} from '@components/pagination/pagination.model';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {AppData, ViewStore} from '@store/view/view.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {Metadata, MetadataStore} from '@store/metadata/metadata.store.service';

export interface FieldMap {
    [key: string]: any;
}

export interface ListEntry {
    type: string;
    attributes: FieldMap;
    id?: string;
}

export interface SearchCriteriaFilter {
    field: string;
    operator: string;
    value: string;
}

export interface SearchCriteria {
    name: string;
    filters: SearchCriteriaFilter[];
}

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
    records: ListEntry[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    selection?: RecordSelection;
    loading: boolean;
}

export interface ListViewModel {
    data: ListViewData;
    appData: AppData;
    metadata: Metadata;
}

export interface ListData {
    records: ListEntry[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
}

const initialState: ListViewState = {
    module: '',
    records: [],
    criteria: null,
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
};

export interface ListViewState {
    module: string;
    records: ListEntry[];
    criteria: SearchCriteria;
    pagination: Pagination;
    selection: RecordSelection;
    loading: boolean;
}

@Injectable()
export class ListViewStore extends ViewStore implements StateStore, DataSource<ListEntry>, SelectionDataSource, PaginationDataSource {

    /**
     * Public long-lived observable streams
     */
    records$: Observable<ListEntry[]>;
    criteria$: Observable<SearchCriteria>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    loading$: Observable<boolean>;

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
    protected resourceName = 'listView';
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
        protected metadataStore: MetadataStore
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
        this.pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
        this.selection$ = this.state$.pipe(map(state => state.selection), distinctUntilChanged());
        this.selectedCount$ = this.state$.pipe(map(state => state.selection.count), distinctUntilChanged());
        this.selectedStatus$ = this.state$.pipe(map(state => state.selection.status), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));

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

        return this.load();
    }

    /**
     * Update the search criteria
     *
     * @param {object} criteria to set
     */
    public updateSearchCriteria(criteria: SearchCriteria): void {
        this.updateState({...this.internalState, criteria, loading: true});
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
     * Pagination Public API
     */

    getPaginationCount(): Observable<PaginationCount> {
        return this.pagination$.pipe(map(pagination => ({
            pageFirst: pagination.pageFirst,
            pageLast: pagination.pageLast,
            total: pagination.total
        } as PaginationCount)), distinctUntilChanged());
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
    protected calculatePageCount(records: ListEntry[], pagination: Pagination): void {
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
        this.appStateStore.updateLoading(`${module}-list-fetch`, true);

        return this.getRecords(
            this.internalState.module,
            this.internalState.criteria,
            this.internalState.pagination,
            useCache
        ).pipe(
            tap((data: ListViewState) => {
                this.appStateStore.updateLoading(`${module}-list-fetch`, false);
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
     * @param {object} pagination to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    protected getRecords(module: string, criteria: SearchCriteria, pagination: Pagination, useCache = true): Observable<ListViewState> {
        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.fetch(module, criteria, pagination).pipe(
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
     * @param {object} pagination to use
     * @returns {object} Observable<any>
     */
    protected fetch(module: string, criteria: SearchCriteria, pagination: Pagination): Observable<ListData> {

        return this.listGQL.fetch(module, pagination.pageSize, pagination.current, {}, this.fieldsMetadata)
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
}
