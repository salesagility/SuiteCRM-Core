import {Injectable} from '@angular/core';
import {StateStore} from '@store/state';
import {RecordList, RecordListStore} from '@store/record-list/record-list.store';
import {BehaviorSubject, Observable} from 'rxjs';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {LanguageStore} from '@store/language/language.store';
import {SubPanel} from '@app-common/metadata/subpanel.metadata.model';
import {Statistic, StatisticsQuery} from '@app-common/statistics/statistics.model';
import {SingleValueStatisticsStore} from '@store/single-value-statistics/single-value-statistics.store';
import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';

export interface SubpanelStoreMap {
    [key: string]: SubpanelStore;
}

@Injectable()
export class SubpanelStore implements StateStore {
    show = false;
    parentModule: string;
    parentId: string;
    recordList: RecordListStore;
    statistics: SingleValueStatisticsStore;
    metadata$: Observable<SubPanel>;
    metadata: SubPanel;
    loading$: Observable<boolean>;
    protected metadataState: BehaviorSubject<SubPanel>;


    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected languageStore: LanguageStore,
        protected statisticsStoreFactory: SingleValueStatisticsStoreFactory
    ) {
        this.recordList = listStoreFactory.create();
        this.statistics = statisticsStoreFactory.create();
        this.metadataState = new BehaviorSubject<SubPanel>({} as SubPanel);
        this.metadata$ = this.metadataState.asObservable();
        this.loading$ = this.recordList.loading$;
    }

    getTitle(): string {
        let label = this.languageStore.getFieldLabel(this.metadata.title_key, this.parentModule);

        if (!label) {
            const moduleList = this.languageStore.getAppListString('moduleList');
            label = (moduleList && moduleList[this.metadata.title_key]) || '';
        }

        return label;
    }

    getIcon(): string {
        return this.metadata.icon;
    }

    clear(): void {
        this.metadataState.unsubscribe();
        this.metadataState = null;
        this.recordList.clear();
        this.recordList = null;
    }

    clearAuthBased(): void {
        this.recordList.clearAuthBased();
    }

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} parentModule name
     * @param {string} parentId id
     * @param {object} meta to use
     */
    public init(parentModule: string, parentId: string, meta: SubPanel): void {
        this.parentModule = parentModule;
        this.parentId = parentId;
        this.metadata = meta;
        this.metadataState.next(this.metadata);
        this.recordList.init(meta.module, false, 'list_max_entries_per_subpanel');

        this.initStatistics(meta, parentModule, parentId);

        this.initSearchCriteria(parentModule, parentId, meta.name);
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    public load(useCache = true): Observable<RecordList> {

        return this.recordList.load(useCache);
    }

    /**
     * Load / reload statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    public loadStatistics(useCache = true): Observable<Statistic> {
        return this.statistics.load(useCache);
    }

    /**
     * Init search criteria
     *
     * @param {string} parentModule name
     * @param {string} parentId id
     * @param {string} subpanel name
     */
    protected initSearchCriteria(parentModule: string, parentId: string, subpanel: string): void {
        this.recordList.criteria = {
            preset: {
                type: 'subpanel',
                params: {
                    subpanel,
                    parentModule,
                    parentId
                }
            }
        };
    }

    /**
     * Init statistics store
     *
     * @param {object} meta for subpanel
     * @param {string} parentModule name
     * @param {string} parentId {id}
     */
    protected initStatistics(meta: SubPanel, parentModule: string, parentId: string): void {
        this.statistics.init(
            meta.module,
            {
                key: meta.module,
                context: {
                    module: parentModule,
                    id: parentId
                }
            } as StatisticsQuery,
            false
        );
    }
}
