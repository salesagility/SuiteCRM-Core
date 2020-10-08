import {Injectable} from '@angular/core';
import {ViewStore} from '@store/view/view.store';
import {MetadataStore, RecordViewMetadata} from '@store/metadata/metadata.store.service';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {StateStore} from '@store/state';
import {deepClone} from '@base/utils/object-utils';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {LocalStorageService} from '@services/local-storage/local-storage.service';
import {MessageService} from '@services/message/message.service';
import {catchError, distinctUntilChanged, finalize, map, tap} from 'rxjs/operators';
import {RecordFetchGQL} from '@store/record/graphql/api.record.get';
import {Record} from '@app-common/record/record.model';
import {ViewMode} from '@base/app-common/views/view.model';
import {RecordViewData, RecordViewModel, RecordViewState} from '@store/record-view/record-view.store.model';
import {RecordManager} from '@store/record/record.manager';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {RecordSaveGQL} from '@store/record/graphql/api.record.save';
import {SubpanelStoreMap} from '@store/subpanel/subpanel.store';
import {SubpanelStoreFactory} from '@store/subpanel/subpanel.store.factory';
import {SubPanelMeta} from '@app-common/metadata/subpanel.metadata.model';

const initialState: RecordViewState = {
    module: '',
    recordID: '',
    loading: false,
    widgets: true,
    mode: 'detail'
};

@Injectable()
export class RecordViewStore extends ViewStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    record$: Observable<Record>;
    stagingRecord$: Observable<Record>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;
    mode$: Observable<ViewMode>;
    subpanels$: Observable<SubpanelStoreMap>;

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<RecordViewModel>;
    vm: RecordViewModel;
    data: RecordViewData;
    recordManager: RecordManager;

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    protected internalState: RecordViewState = deepClone(initialState);
    protected store = new BehaviorSubject<RecordViewState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected subpanels: SubpanelStoreMap;
    protected subpanelsState: BehaviorSubject<SubpanelStoreMap>;

    constructor(
        protected recordFetchGQL: RecordFetchGQL,
        protected recordSaveGQL: RecordSaveGQL,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected message: MessageService,
        protected subpanelFactory: SubpanelStoreFactory
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.recordManager = new RecordManager(
            languageStore,
            this.getViewFieldsObservable(),
            recordSaveGQL,
            recordFetchGQL,
            message
        );

        this.record$ = this.recordManager.state$.pipe(distinctUntilChanged());
        this.stagingRecord$ = this.recordManager.staging$.pipe(distinctUntilChanged());
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

        this.subpanelsState = new BehaviorSubject<SubpanelStoreMap>({} as SubpanelStoreMap);
        this.subpanels$ = this.subpanelsState.asObservable();
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

    getSubpanels(): SubpanelStoreMap {
        return this.subpanels;
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
    public init(module: string, recordID: string): Observable<Record> {
        this.internalState.module = module;
        this.internalState.recordID = recordID;
        this.initSubpanels(module, recordID);

        return this.load();
    }

    /**
     * Clear observable cache
     */
    public clear(): void {
        this.cache$ = null;
        this.clearSubpanels();
        this.subpanelsState.unsubscribe();
        this.updateState(deepClone(initialState));
    }

    /**
     * Get staging record
     *
     * @returns {string} ViewMode
     */
    getRecord(): Record {
        if (!this.internalState) {
            return null;
        }
        return this.recordManager.getRecord();
    }

    /**
     * Get current view mode
     *
     * @returns {string} ViewMode
     */
    getMode(): ViewMode {
        if (!this.internalState) {
            return null;
        }
        return this.internalState.mode;
    }

    /**
     * Set new mode
     *
     * @param {string} mode ViewMode
     */
    setMode(mode: ViewMode): void {
        this.updateState({...this.internalState, mode});
    }

    save(): Observable<Record> {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-save`, true);

        return this.recordManager.save().pipe(
            catchError(() => {
                this.message.addDangerMessageByKey('LBL_ERROR_SAVING');
                return of({} as Record);
            }),
            finalize(() => {
                this.setMode('detail' as ViewMode);
                this.appStateStore.updateLoading(`${this.internalState.module}-record-save`, false);
            })
        );
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
     * Init subpanels
     *
     * @param {string} module parent module
     * @param {string} recordId id
     */
    protected initSubpanels(module: string, recordId: string): void {
        this.metadataStore.subPanelMetadata$.subscribe((meta: SubPanelMeta) => {
            this.clearSubpanels();

            Object.keys(meta).forEach((key: string) => {
                this.subpanels[key] = this.subpanelFactory.create();
                this.subpanels[key].init(module, recordId, meta[key]);
            });

            this.subpanelsState.next(this.subpanels);
        });
    }

    protected clearSubpanels(): void {
        if (this.subpanels) {
            Object.keys(this.subpanels).forEach((key: string) => {
                this.subpanels[key].clear();
            });
        }

        this.subpanels = {};
    }

    /**
     * Get view fields observable
     *
     * @returns {object} Observable<ViewFieldDefinition[]>
     */
    protected getViewFieldsObservable(): Observable<ViewFieldDefinition[]> {
        return this.metadataStore.recordViewMetadata$.pipe(map((recordMetadata: RecordViewMetadata) => {
            const fields: ViewFieldDefinition[] = [];
            recordMetadata.panels.forEach(panel => {
                panel.rows.forEach(row => {
                    row.cols.forEach(col => {
                        fields.push(col);
                    });
                });
            });

            return fields;
        }));
    }

    /**
     * Load / reload record using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    protected load(useCache = true): Observable<Record> {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, true);

        return this.recordManager.retrieveRecord(
            this.internalState.module,
            this.internalState.recordID,
            useCache
        ).pipe(
            tap((data: Record) => {
                this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, false);

                this.updateState({
                    ...this.internalState,
                    recordID: data.id,
                    module: data.module,
                });
            })
        );
    }

}
