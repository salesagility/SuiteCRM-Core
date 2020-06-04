import {deepClone} from '@base/utils/object-utils';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';
import {StateStore} from '@store/state';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateStore} from '@store/app-state/app-state.store';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';

export interface FieldMap {
    [key: string]: any;
}

export interface ListEntry {
    module: string;
    records: FieldMap;
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
}

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
        pageSizes: [5, 10, 20, 50]
    },
    loading: false,
};

export interface ListViewState {
    module: string;
    records: ListEntry[];
    criteria: SearchCriteria;
    pagination: Pagination;
    loading: boolean;
}

@Injectable()
export class ListViewStore implements StateStore, DataSource<ListEntry> {
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

    /**
     * Public long-lived observable streams
     */
    records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
    criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
    pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
    loading$ = this.state$.pipe(map(state => state.loading));

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<ListViewModel> = combineLatest(
        [
            this.records$,
            this.criteria$,
            this.pagination$,
            this.loading$
        ]).pipe(
        map((
            [
                records,
                criteria,
                pagination,
                loading
            ]) => ({records, criteria, pagination, loading}))
    );

    constructor(protected recordGQL: RecordGQL, protected appState: AppStateStore) {
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
