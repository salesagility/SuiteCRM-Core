import {Injectable} from '@angular/core';
import {ViewStore} from '@store/view/view.store';
import {Metadata, MetadataStore, RecordViewMetadata, SummaryTemplates} from '@store/metadata/metadata.store.service';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {StateStore} from '@store/state';
import {deepClone} from '@base/app-common/utils/object-utils';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {LocalStorageService} from '@services/local-storage/local-storage.service';
import {MessageService} from '@services/message/message.service';
import {catchError, distinctUntilChanged, finalize, map, take, tap} from 'rxjs/operators';
import {RecordFetchGQL} from '@store/record/graphql/api.record.get';
import {Record} from '@app-common/record/record.model';
import {ViewContext, ViewMode} from '@app-common/views/view.model';
import {
    RecordViewData,
    RecordViewModel,
    RecordViewState
} from '@views/record/store/record-view/record-view.store.model';
import {RecordStore} from '@store/record/record.store';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {RecordSaveGQL} from '@store/record/graphql/api.record.save';
import {SubpanelStoreMap} from '@containers/subpanel/store/subpanel/subpanel.store';
import {SubpanelStoreFactory} from '@containers/subpanel/store/subpanel/subpanel.store.factory';
import {SubPanelMeta} from '@app-common/metadata/subpanel.metadata.model';
import {RecordManager} from '@services/record/record.manager';
import {StatisticsBatch} from '@store/statistics/statistics-batch.service';
import {StatisticsMap, StatisticsQueryMap} from '@app-common/statistics/statistics.model';
import {Params} from '@angular/router';
import {FieldDefinitionMap} from '@app-common/record/field.model';

const initialState: RecordViewState = {
    module: '',
    recordID: '',
    loading: false,
    widgets: false,
    showSidebarWidgets: false,
    showTopWidget: false,
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
    showSidebarWidgets$: Observable<boolean>;
    showTopWidget$: Observable<boolean>;
    mode$: Observable<ViewMode>;
    subpanels$: Observable<SubpanelStoreMap>;

    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<RecordViewModel>;
    vm: RecordViewModel;
    data: RecordViewData;
    recordStore: RecordStore;

    /** Internal Properties */
    protected cache$: Observable<any> = null;
    protected internalState: RecordViewState = deepClone(initialState);
    protected store = new BehaviorSubject<RecordViewState>(this.internalState);
    protected state$ = this.store.asObservable();
    protected subpanels: SubpanelStoreMap;
    protected subpanelsState: BehaviorSubject<SubpanelStoreMap>;
    protected subs: Subscription[] = [];

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
        protected subpanelFactory: SubpanelStoreFactory,
        protected recordManager: RecordManager,
        protected statisticsBatch: StatisticsBatch,
    ) {

        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);

        this.recordStore = new RecordStore(
            this.getViewFieldsObservable(),
            recordSaveGQL,
            recordFetchGQL,
            message,
            recordManager
        );

        this.record$ = this.recordStore.state$.pipe(distinctUntilChanged());
        this.stagingRecord$ = this.recordStore.staging$.pipe(distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
        this.widgets$ = this.state$.pipe(map(state => state.widgets));
        this.showSidebarWidgets$ = this.state$.pipe(map(state => state.showSidebarWidgets));
        this.showTopWidget$ = this.state$.pipe(map(state => state.showTopWidget));
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

    get showTopWidget(): boolean {
        return this.internalState.showTopWidget;
    }

    set showTopWidget(show: boolean) {
        this.updateState({
            ...this.internalState,
            showTopWidget: show
        });
    }

    getModuleName(): string {
        return this.internalState.module;
    }

    getRecordId(): string {
        return this.internalState.recordID;
    }

    getViewContext(): ViewContext {
        return {
            module: this.getModuleName(),
            id: this.getRecordId(),
        };
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

        this.calculateShowWidgets();

        return this.load().pipe(
            tap(() => {
                this.showTopWidget = true;
                this.loadSubpanelStatistics(module);
            })
        );
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
    getBaseRecord(): Record {
        if (!this.internalState) {
            return null;
        }
        return this.recordStore.getBaseRecord();
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

        return this.recordStore.save().pipe(
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
     * Load / reload record using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    public load(useCache = true): Observable<Record> {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, true);

        return this.recordStore.retrieveRecord(
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

    /**
     * Get summary template
     *
     * @returns {string} summary template label
     */
    getSummaryTemplate(): string {
        const metadata = this.metadata || {} as Metadata;
        const recordMeta = metadata.recordView || {} as RecordViewMetadata;
        const templates = recordMeta.summaryTemplates || {} as SummaryTemplates;
        return templates[this.getMode()] || '';
    }

    /**
     * Load all statistics
     *
     * @param {string} module if to use cache
     */
    protected loadSubpanelStatistics(module: string): void {
        const subpanels = this.subpanelsState.value;

        if (!subpanels) {
            return;
        }

        const queries: StatisticsQueryMap = {};

        Object.keys(subpanels).forEach(subpanelKey => {

            const subpanel = subpanels[subpanelKey];
            const statsMap = subpanel.statistics;

            if (!statsMap || !Object.keys(statsMap).length) {
                return;
            }

            if (subpanel.shouldBatchStatistic() === false) {
                subpanel.loadAllStatistics().pipe(take(1)).subscribe();
                return;
            }

            const subpanelQueries = subpanel.getAllStatisticQuery();

            Object.keys(subpanelQueries).forEach(subpanelQueryKey => {
                const queryKey = this.buildStatKey(subpanelKey, subpanelQueryKey);
                queries[queryKey] = subpanelQueries[subpanelQueryKey];
            });

            subpanel.setAllStatisticsLoading(true);
        });

        this.statisticsBatch.fetch(module, queries)
            .pipe(take(1))
            .subscribe((stats: StatisticsMap) => {

                Object.keys(subpanels).forEach(subpanelKey => {

                    const subpanel = subpanels[subpanelKey];
                    const subpanelQueries = subpanel.getAllStatisticQuery();

                    Object.keys(subpanelQueries).forEach(subpanelQueryKey => {
                        const queryKey = this.buildStatKey(subpanelKey, subpanelQueryKey);
                        const stat = stats[queryKey];
                        if (!stat) {
                            return;
                        }
                        subpanel.setStatistics(subpanelQueryKey, stat, true);
                    });

                    subpanel.setAllStatisticsLoading(false);
                });
            });
    }

    protected buildStatKey(subpanelKey: string, subpanelQueryKey: string): string {
        subpanelKey = subpanelKey.replace(/_/g, '-');
        subpanelQueryKey = subpanelQueryKey.replace(/_/g, '-');

        return subpanelKey + '-' + subpanelQueryKey;
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
                this.subpanels[key].init(module, recordId, meta[key], this.record$);
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
     * Calculate if widgets are to display
     */
    protected calculateShowWidgets(): void {
        let show = false;
        const recordViewMeta = this.getRecordViewMetadata();
        const sidebarWidgetsConfig = recordViewMeta.sidebarWidgets || [];

        if (sidebarWidgetsConfig && sidebarWidgetsConfig.length > 0) {
            show = true;
        }

        this.showSidebarWidgets = show;
        this.widgets = show;
    }

    /**
     * Get record view metadata
     *
     * @returns {object} metadata RecordViewMetadata
     */
    protected getRecordViewMetadata(): RecordViewMetadata {
        const meta = this.metadataStore.get() || {};
        return meta.recordView || {} as RecordViewMetadata;
    }

    /**
     * Get vardefs
     *
     * @returns {object} vardefs FieldDefinitionMap
     */
    protected getVardefs(): FieldDefinitionMap {
        const meta = this.getRecordViewMetadata();
        return meta.vardefs || {} as FieldDefinitionMap;
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

}
