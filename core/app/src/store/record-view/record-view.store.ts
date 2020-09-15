import {Injectable} from '@angular/core';
import {AppData, ViewStore} from '@store/view/view.store';
import {Metadata, MetadataStore} from '@store/metadata/metadata.store.service';
import {BehaviorSubject, combineLatest, Observable, throwError} from 'rxjs';
import {StateStore} from '@store/state';
import {deepClone} from '@base/utils/object-utils';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {LocalStorageService} from '@services/local-storage/local-storage.service';
import {MessageService} from '@services/message/message.service';
import {catchError, distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';
import {RecordViewGQL} from '@store/record-view/api.record.get';
import {Record} from '@app-common/record/record.model';
import {ViewMode} from '@base/app-common/views/view.model';

export interface RecordViewModel {
    data: RecordViewData;
    appData: AppData;
    metadata: Metadata;
}

export interface RecordViewData {
    record: Record;
    loading: boolean;
}

export interface RecordViewState {
    module: string;
    recordID: string;
    record: Record;
    loading: boolean;
    widgets: boolean;
    mode: ViewMode;
}

const initialState: RecordViewState = {
    module: '',
    recordID: '',
    record: {
        type: '',
        module: '',
        attributes: {}
    } as Record,
    loading: false,
    widgets: true,
    mode: 'detail'
};

export interface RecordData {
    record: Record;
    module: string;
    recordID: string;
}

@Injectable()
export class RecordViewStore extends ViewStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    record$: Observable<Record>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;
    mode$: Observable<ViewMode>;

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<RecordViewModel>;
    vm: RecordViewModel;
    data: RecordViewData;

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
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected message: MessageService,
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.record$ = this.state$.pipe(map(state => state.record), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
        this.widgets$ = this.state$.pipe(map(state => state.widgets));
        this.mode$ = this.state$.pipe(map(state => state.mode));

        const data$ = combineLatest(
            [this.record$, this.loading$]
        ).pipe(
            map(([record, loading]) => {
                this.data = {record, loading} as RecordViewData;
                return this.data;
            })
        );

        this.vm$ = combineLatest([data$, this.appData$, this.metadata$]).pipe(
            map(([data, appData, metadata]) => {
                this.vm = {data, appData, metadata} as RecordViewModel;
                return this.vm;
            }));
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
     * Load / reload record using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    protected load(useCache = true): Observable<RecordViewState> {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, true);

        return this.getRecord(
            this.internalState.module,
            this.internalState.recordID,
            useCache
        ).pipe(
            tap((data: RecordViewState) => {
                this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, false);
                this.updateState({
                    ...this.internalState,
                    record: data.record,
                    recordID: data.recordID,
                    module: data.module,
                });
            })
        );
    }

    /**
     * Get record cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    protected getRecord(
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

                    const recordData = {
                        record: {
                            type: '',
                            module: '',
                            attributes: {}
                        } as Record,
                        recordID,
                        module,
                    } as RecordData;

                    const record: Record = {
                        type: '',
                        module: '',
                        attributes: {}
                    } as Record;

                    if (!data) {
                        return recordData;
                    }

                    const id = data.getRecordView.record.id;
                    if (!id) {
                        this.message.addDangerMessageByKey('LBL_RECORD_DOES_NOT_EXIST');
                        return false;
                    }

                    record.id = id;
                    record.module = module;
                    record.type = data.getRecordView.record && data.getRecordView.record.object_name;
                    record.attributes = data.getRecordView.record;

                    recordData.record = record;

                    return recordData;
                }),
                catchError(err => throwError(err)),
            );
    }
}
