import {Injectable} from '@angular/core';
import {AppData, ViewStore} from '@store/view/view.store';
import {Metadata, MetadataStore} from '@store/metadata/metadata.store.service';
import {BehaviorSubject, combineLatest, Observable, throwError} from 'rxjs';
import {StateStore} from '@store/state';
import {DataSource} from '@angular/cdk/table';
import {deepClone} from '@base/utils/object-utils';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {LocalStorageService} from '@services/local-storage/local-storage.service';
import {MessageService} from '@services/message/message.service';
import {distinctUntilChanged, map, shareReplay, tap, catchError} from 'rxjs/operators';
import {Record} from '@store/list-view/list-view.store';
import {RecordViewGQL} from '@store/record-view/api.record.get';

export interface RecordViewModel {
    appData: AppData;
    metadata: Metadata;
}

export interface RecordViewData {
    records: Record[];
    loading: boolean;
}

export interface RecordViewState {
    module: string;
    recordID: string;
    records: Record[];
    loading: boolean;
    widgets: boolean;
}

const initialState: RecordViewState = {
    module: '',
    recordID: '',
    records: [],
    loading: false,
    widgets: true
};

export interface RecordData {
    records: Record[];
}

@Injectable()
export class RecordViewStore extends ViewStore implements StateStore, DataSource<Record> {

    /**
     * Public long-lived observable streams
     */
    records$: Observable<Record[]>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<RecordViewModel>;
    vm: RecordViewModel;
    data: RecordViewData;

    protected displayFilters = false;

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    protected internalState: RecordViewState = deepClone(initialState);
    protected store = new BehaviorSubject<RecordViewState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected fieldsMetadata = {
        fields: [
            '_id',
            'id',
            'record'
        ]
    };

    constructor(
        protected recordViewGQL: RecordViewGQL,
        protected configStore: SystemConfigStore,
        protected preferencesStore: UserPreferenceStore,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected message: MessageService,
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
        this.widgets$ = this.state$.pipe(map(state => state.widgets));

        const data$ = combineLatest(
            [this.records$, this.loading$]
        ).pipe(
            map(([records, loading]) => {
                this.data = {records, loading} as RecordViewData;
                return this.data;
            })
        );

        this.vm$ = combineLatest([data$, this.appData$, this.metadata$]).pipe(
            map(([data, appData, metadata]) => {
                this.vm = {data, appData, metadata} as RecordViewModel;
                return this.vm;
            }));
    }

    connect(): Observable<any> {
        return this.records$;
    }

    disconnect(): void {
        this.destroy();
    }

    get showWidgets(): boolean {
        return true;
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
    }

    /**
     * Initial record load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @returns {object} Observable<any>
     */
    public init(module: string, recordID: string): Observable<RecordViewState> {
        this.internalState.module = module;
        this.internalState.recordID = recordID;

        return this.load();
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
    protected updateState(state: RecordViewState): void {
        this.store.next(this.internalState = state);
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    protected load(useCache = true): Observable<RecordViewState> {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, true);

        return this.getRecords(
            this.internalState.module,
            this.internalState.recordID,
            useCache
        ).pipe(
            tap((data: RecordViewState) => {
                this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, false);
                this.updateState({
                    ...this.internalState,
                    records: data.records,
                });
            })
        );
    }

    /**
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    protected getRecords(
        module: string,
        recordID: string,
        useCache = true
    ): Observable<RecordViewState> {
        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.fetch(module, recordID).pipe(
                shareReplay(1)
            );
        }
        return this.cache$;
    }

    /**
     * Fetch the record from the backend
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @returns {object} Observable<any>
     */
    protected fetch(module: string, recordID: string): Observable<any> {
        return this.recordViewGQL.fetch(module, recordID, this.fieldsMetadata)
            .pipe(
                map(({data}) => {
                    const id = data.getRecordView.record.id;
                    if (id) {
                        return true;
                    }
                    this.message.addDangerMessageByKey('LBL_RECORD_DOES_NOT_EXIST');
                    return false;
                }),
                catchError(err => throwError(err)),
            );
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
