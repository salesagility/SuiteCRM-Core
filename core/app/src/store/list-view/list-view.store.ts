import {deepClone} from '@base/utils/object-utils';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';
import {StateStore} from '@store/state';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateStore} from '@store/app-state/app-state.store';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';
import {SelectionDataSource, SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';

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
    selectedSize: number;
    currentPage: number;
    pageSizes: number[];
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


export interface ListViewModel {
    records: ListEntry[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    loading: boolean;
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
        currentPage: 0,
        selectedSize: 5,
        pageSizes: [5, 10, 20, 50],
        total: 300
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
export class ListViewStore implements StateStore, DataSource<ListEntry>, SelectionDataSource {

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

    constructor(protected recordGQL: RecordGQL, protected appState: AppStateStore) {

        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
        this.pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
        this.selection$ = this.state$.pipe(map(state => state.selection), distinctUntilChanged());
        this.selectedCount$ = this.state$.pipe(map(state => state.selection.count), distinctUntilChanged());
        this.selectedStatus$ = this.state$.pipe(map(state => state.selection.status), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));

        this.vm$ = combineLatest(
            [
                this.records$,
                this.criteria$,
                this.pagination$,
                this.selection$,
                this.loading$
            ]).pipe(
            map((
                [
                    records,
                    criteria,
                    pagination,
                    selection,
                    loading
                ]) => ({records, criteria, pagination, selection, loading}))
        );
    }

    connect(): Observable<any> {
        return this.records$;
    }

    disconnect(): void {
        this.destroy();
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
    public init(module: string): Observable<any> {
        this.internalState.module = module;

        this.appState.updateLoading(`${module}-list-fetch`, true);

        return this.getRecords(this.internalState.module, this.internalState.criteria, this.internalState.pagination).pipe(
            tap((data: ListViewState) => {
                this.appState.updateLoading(`${module}-list-fetch`, false);
                this.updateState({
                    ...this.internalState,
                    records: data.records,
                });
            })
        );
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
     * @param {number} currentPage to set
     */
    public updatePagination(currentPage: number): void {
        const pagination = {...this.internalState.pagination, currentPage};
        this.updateState({...this.internalState, pagination, loading: true});
    }

    /**
     * Clear observable cache
     */
    public clear(): void {
        this.cache$ = null;
        this.updateState(deepClone(initialState));
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
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {object} criteria to use
     * @param {object} pagination to use
     * @returns {object} Observable<any>
     */
    protected getRecords(module: string, criteria: SearchCriteria, pagination: Pagination): Observable<ListViewState> {
        if (this.cache$ == null) {
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
        return this.recordGQL.fetch(this.resourceName, `/api/records/${module}`, this.fieldsMetadata)
            .pipe(
                map(({data}) => {
                    const listData: ListData = {
                        records: []
                    };

                    if (data && data.listView.records) {
                        data.listView.records.forEach((record: any) => {
                            listData.records.push(
                                record
                            );
                        });
                    }

                    return listData;
                })
            );
    }
}
