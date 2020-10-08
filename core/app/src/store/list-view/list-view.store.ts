import {deepClone} from '@base/utils/object-utils';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, take} from 'rxjs/operators';
import {StateStore} from '@store/state';
import {AppStateStore} from '@store/app-state/app-state.store';
import {Injectable} from '@angular/core';
import {FilterDataSource} from '@components/list-filter/list-filter.component';
import {BulkActionDataSource, SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {ChartTypesDataSource} from '@components/chart/chart.component';
import {AppData, ViewStore} from '@store/view/view.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {Metadata, MetadataStore} from '@store/metadata/metadata.store.service';
import {LocalStorageService} from '@services/local-storage/local-storage.service';
import {BulkActionProcess, BulkActionProcessInput} from '@services/process/processes/bulk-action/bulk-action';
import {MessageService} from '@services/message/message.service';
import {Process} from '@services/process/process.service';
import {Record} from '@app-common/record/record.model';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {RecordList, RecordListStore} from '@store/record-list/record-list.store';
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {BulkActionsMap} from '@app-common/actions/bulk-action.model';
import {LineAction} from '@app-common/actions/line-action.model';
import {Pagination, SortingSelection} from '@app-common/views/list/list-navigation.model';
import {RecordSelection} from '@app-common/views/list/record-selection.model';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';

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
    displayFilters: false
};

export interface ListViewState {
    module: string;
    widgets: boolean;
    displayFilters: boolean;
}

@Injectable()
export class ListViewStore extends ViewStore implements StateStore,
    BulkActionDataSource,
    ChartTypesDataSource,
    FilterDataSource {

    /**
     * Public long-lived observable streams
     */
    moduleName$: Observable<string>;
    columns$: Observable<ColumnDefinition[]>;
    lineActions$: Observable<LineAction[]>;
    records$: Observable<Record[]>;
    criteria$: Observable<SearchCriteria>;
    sort$: Observable<SortingSelection>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;
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
        protected bulkAction: BulkActionProcess,
        protected message: MessageService,
        protected listStoreFactory: RecordListStoreFactory
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.recordList = this.listStoreFactory.create();

        this.columns$ = metadataStore.listViewColumns$;
        this.lineActions$ = metadataStore.listViewLineActions$;
        this.records$ = this.recordList.records$;
        this.criteria$ = this.recordList.criteria$;
        this.sort$ = this.recordList.sort$;
        this.pagination$ = this.recordList.pagination$;
        this.selection$ = this.recordList.selection$;
        this.selectedCount$ = this.recordList.selectedCount$;
        this.selectedStatus$ = this.recordList.selectedStatus$;
        this.loading$ = this.recordList.loading$;
        this.moduleName$ = this.state$.pipe(map(state => state.module), distinctUntilChanged());
        this.widgets$ = this.state$.pipe(map(state => state.widgets), distinctUntilChanged());
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

    get showWidgets(): boolean {

        if (!this.getChartTypes() || !Object.keys(this.getChartTypes()).length) {
            return false;
        }

        return this.internalState.widgets;
    }

    set showWidgets(show: boolean) {
        this.updateState({
            ...this.internalState,
            widgets: show
        });
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

    public getChartTypes(): any {
        if (!this.metadata || !this.metadata.listView) {
            return null;
        }

        return this.metadata.listView.chartTypes;
    }

    public getFilter(): any {
        return this.metadata.listView.filters;
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
        } as BulkActionProcessInput;


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
