import {deepClone} from '@base/app-common/utils/object-utils';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, take, tap} from 'rxjs/operators';
import {StateStore} from '@store/state';
import {AppStateStore} from '@store/app-state/app-state.store';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';
import {SelectionDataSource, SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {ListGQL} from '@store/record-list/graphql/api.list.get';
import {PageSelection, PaginationCount, PaginationDataSource} from '@components/pagination/pagination.model';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {LanguageStore} from '@store/language/language.store';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {MessageService} from '@services/message/message.service';
import {Record} from '@app-common/record/record.model';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {Pagination, SortingSelection} from '@app-common/views/list/list-navigation.model';
import {RecordSelection} from '@app-common/views/list/record-selection.model';

const initialSearchCriteria = {
    filters: {}
};

const initialListSort = {
    orderBy: '',
    sortOrder: SortDirection.DESC
};

const initialSelection: RecordSelection = {
    all: false,
    status: SelectionStatus.NONE,
    selected: {},
    count: 0
};


export interface RecordList {
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
}

export interface RecordListState {
    module: string;
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    selection: RecordSelection;
    loading: boolean;
}

const initialState: RecordListState = {
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
};

@Injectable()
export class RecordListStore implements StateStore, DataSource<Record>, SelectionDataSource, PaginationDataSource {

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

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    protected internalState: RecordListState = deepClone(initialState);
    protected store = new BehaviorSubject<RecordListState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected preferencesSub: Subscription;

    constructor(
        protected listGQL: ListGQL,
        protected configStore: SystemConfigStore,
        protected preferencesStore: UserPreferenceStore,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected message: MessageService,
    ) {
        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
        this.sort$ = this.state$.pipe(map(state => state.sort), distinctUntilChanged());
        this.pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
        this.selection$ = this.state$.pipe(map(state => state.selection), distinctUntilChanged());
        this.selectedCount$ = this.state$.pipe(map(state => state.selection.count), distinctUntilChanged());
        this.selectedStatus$ = this.state$.pipe(map(state => state.selection.status), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
    }

    connect(): Observable<any> {
        return this.records$;
    }

    disconnect(): void {
    }

    get criteria(): SearchCriteria {
        if (!this.internalState.criteria) {
            return deepClone(initialSearchCriteria);
        }

        return deepClone(this.internalState.criteria);
    }

    set criteria(criteria: SearchCriteria) {
        this.updateState({
            ...this.internalState,
            criteria
        });
    }

    get sort(): SortingSelection {
        if (!this.internalState.sort) {
            return deepClone(initialListSort);
        }

        return deepClone(this.internalState.sort);
    }

    set sort(sort: SortingSelection) {
        this.updateState({
            ...this.internalState,
            sort
        });
    }

    get selection(): RecordSelection {
        if (!this.internalState.selection) {
            return deepClone(initialSelection);
        }

        return deepClone(this.internalState.selection);
    }

    get records(): Record[] {
        if (!this.internalState.records) {
            return [];
        }

        return this.internalState.records;
    }

    getModule(): string {
        return this.internalState.module;
    }

    getRecord(id: string): Record {
        let record: Record = null;
        this.records.some(item => {
            if (item.id === id) {
                record = item;
                return true;
            }
        });

        return record;
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
     * @param {boolean} load if to load
     * @param {string} pageSizeConfigKey string
     * @returns {object} Observable<any>
     */
    public init(module: string, load = true, pageSizeConfigKey = 'list_max_entries_per_page'): Observable<RecordList> {
        this.internalState.module = module;

        this.watchPageSize(pageSizeConfigKey);

        if (load === false) {
            return null;
        }

        return this.load();
    }


    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    public load(useCache = true): Observable<RecordList> {

        this.updateState({
            ...this.internalState,
            loading: true
        });

        return this.getRecords(
            this.internalState.module,
            this.internalState.criteria,
            this.internalState.sort,
            this.internalState.pagination,
            useCache
        ).pipe(
            tap((data: RecordList) => {
                this.calculatePageCount(data.records, data.pagination);
                this.updateState({
                    ...this.internalState,
                    records: data.records,
                    pagination: data.pagination,
                    loading: false
                });
            })
        );
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
            // Change page trigger data re-load
            this.changePage(PageSelection.FIRST);
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
            orderBy = '';
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
        this.store.unsubscribe();
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

            if (pageToLoad > this.internalState.pagination.last) {
                return;
            }

            if (pageToLoad < 0) {
                return;
            }

            this.updatePagination(pageToLoad);
        }
    }

    /**
     * Internal API
     */

    /**
     * Subscribe to page size changes
     *
     * @param {string} pageSizeConfigKey key
     */
    protected watchPageSize(pageSizeConfigKey: string): void {

        const pageSizePreference = this.preferencesStore.getUserPreference(pageSizeConfigKey);
        const pageSizeConfig = this.configStore.getConfigValue(pageSizeConfigKey);
        this.determinePageSize(pageSizePreference, pageSizeConfig);

        this.preferencesSub = combineLatest([this.configStore.configs$, this.preferencesStore.userPreferences$])
            .pipe(
                tap(([configs, preferences]) => {
                    const key = pageSizeConfigKey;
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
    protected updateState(state: RecordListState): void {
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
    ): Observable<RecordList> {

        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.listGQL.get(module, criteria, sort, pagination).pipe(
                shareReplay(1)
            );
        }
        return this.cache$;
    }
}
