/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Injectable} from '@angular/core';
import {StateStore} from '../../../../store/state';
import {RecordList, RecordListStore} from '../../../../store/record-list/record-list.store';
import {BehaviorSubject, forkJoin, Observable, Subscription} from 'rxjs';
import {RecordListStoreFactory} from '../../../../store/record-list/record-list.store.factory';
import {LanguageStore} from '../../../../store/language/language.store';
import {SubPanelDefinition} from 'common';
import {Statistic, StatisticsMap, StatisticsQuery, StatisticsQueryMap} from 'common';
import {SingleValueStatisticsStore} from '../../../../store/single-value-statistics/single-value-statistics.store';
import {SingleValueStatisticsStoreFactory} from '../../../../store/single-value-statistics/single-value-statistics.store.factory';
import {deepClone} from 'common';
import {StatisticWidgetOptions} from 'common';
import {Record} from 'common';

export interface SubpanelStoreMap {
    [key: string]: SubpanelStore;
}

export interface SingleValueStatisticsStoreMap {
    [key: string]: SingleValueStatisticsStore;
}

@Injectable()
export class SubpanelStore implements StateStore {
    show = false;
    parentModule: string;
    parentId: string;
    parentRecord$: Observable<Record>;
    parentRecord: Record;
    recordList: RecordListStore;
    statistics: SingleValueStatisticsStoreMap;
    metadata$: Observable<SubPanelDefinition>;
    metadata: SubPanelDefinition;
    loading$: Observable<boolean>;
    protected metadataState: BehaviorSubject<SubPanelDefinition>;
    protected subs: Subscription[] = [];


    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected languageStore: LanguageStore,
        protected statisticsStoreFactory: SingleValueStatisticsStoreFactory
    ) {
        this.recordList = listStoreFactory.create();
        this.statistics = {};
        this.metadataState = new BehaviorSubject<SubPanelDefinition>({} as SubPanelDefinition);
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
        this.subs.forEach(sub => sub.unsubscribe());
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
     * @param {object} parentRecord$ to use
     */
    public init(parentModule: string, parentId: string, meta: SubPanelDefinition, parentRecord$: Observable<Record> = null): void {
        this.parentModule = parentModule;
        this.parentId = parentId;
        this.metadata = meta;
        this.metadataState.next(this.metadata);
        this.recordList.init(meta.module, false, 'list_max_entries_per_subpanel');

        this.initStatistics(meta, parentModule, parentId);

        this.initSearchCriteria(parentModule, parentId, meta.name);

        if (parentRecord$) {
            this.parentRecord$ = parentRecord$;
            this.parentRecord$.subscribe(record => this.parentRecord = record);
        }

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
     * Get statistic store
     *
     * @param {string} key key of statistic
     * @returns {object} SingleValueStatisticsStore
     */
    public getStatistic(key: string): SingleValueStatisticsStore {
        if (!this.statistics[key]) {
            return null;
        }

        return this.statistics[key];
    }

    /**
     * Load / reload statistics
     *
     * @param {string} key of statistic
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    public loadStatistics(key: string, useCache = true): Observable<Statistic> {
        if (!this.statistics[key]) {
            return null;
        }

        return this.statistics[key].load(useCache);
    }

    /**
     * Load / reload all statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    public loadAllStatistics(useCache = true): Observable<StatisticsMap> {
        if (!this.statistics || !Object.keys(this.statistics).length) {
            return null;
        }

        const stats$ = {};

        Object.keys(this.statistics).forEach(statisticKey => {

            if (!this.statistics[statisticKey]) {
                return;
            }
            stats$[statisticKey] = this.loadStatistics(statisticKey, useCache);
        });

        return forkJoin(stats$);
    }

    /**
     * Should batch statistic
     *
     * @returns {boolean} shouldBatch
     */
    public shouldBatchStatistic(): boolean {
        const metadata: SubPanelDefinition = this.metadata || {} as SubPanelDefinition;
        return !(metadata.insightWidget && metadata.insightWidget.batch && metadata.insightWidget.batch === false);
    }

    /**
     * Set loading
     *
     * @param {string} key of statistic
     * @param {boolean} loading bool
     */
    public setStatisticsLoading(key: string, loading: boolean): void {
        if (!this.statistics[key]) {
            return;
        }
        this.statistics[key].setLoading(loading);
    }

    /**
     * Set all statistics loading
     *
     * @param {boolean} loading bool
     */
    public setAllStatisticsLoading(loading: boolean): void {

        if (!this.statistics || !Object.keys(this.statistics).length) {
            return;
        }

        Object.keys(this.statistics).forEach(statisticKey => {

            if (!this.statistics[statisticKey]) {
                return;
            }
            this.setStatisticsLoading(statisticKey, loading);
        });
    }

    /**
     * Set Statistic value
     *
     * @param {string} key of statistic
     * @param {object} statistic Statistic
     * @param {boolean} cache bool
     */
    public setStatistics(key: string, statistic: Statistic, cache = false): void {
        if (!this.statistics[key]) {
            return;
        }
        this.statistics[key].setStatistic(key, statistic, cache);
    }

    /**
     * Get statistic query
     *
     * @param {string} key of statistic
     * @returns {object} StatisticsQuery
     */
    public getStatisticQuery(key: string): StatisticsQuery {
        return this.statistics[key].getQuery();
    }

    /**
     * Get all statistics queries
     *
     * @returns {object} StatisticsQuery
     */
    public getAllStatisticQuery(): StatisticsQueryMap {

        if (!this.statistics || !Object.keys(this.statistics).length) {
            return {};
        }

        const queriesMap = {};

        Object.keys(this.statistics).forEach(statisticKey => {

            if (!this.statistics[statisticKey]) {
                return;
            }
            queriesMap[statisticKey] = this.getStatisticQuery(statisticKey);
        });

        return queriesMap;
    }

    /**
     * Get widget layout
     *
     * @returns {any} any
     */
    public getWidgetLayout(): StatisticWidgetOptions {

        const meta = this.metadata;
        if (!meta || !meta.insightWidget || !meta.insightWidget.options || !meta.insightWidget.options.insightWidget) {
            return {rows: []} as StatisticWidgetOptions;
        }

        const layout = deepClone(meta.insightWidget.options.insightWidget);

        if (!layout.rows || !layout.rows.length) {
            layout.rows = {};
        }

        return layout;
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
    protected initStatistics(meta: SubPanelDefinition, parentModule: string, parentId: string): void {

        const layout = this.getWidgetLayout();

        layout.rows.forEach(row => {

            if (!row.cols || !row.cols.length) {
                return;
            }

            row.cols.forEach(col => {

                if (!col.statistic || typeof col.statistic !== 'string') {
                    return;
                }

                this.initStatistic(col.statistic, meta, parentModule, parentId);
                col.store = this.statistics[col.statistic];
            });
        });
    }

    /**
     * Init a single value statistic
     *
     * @param {string} statisticKey to use
     * @param {object} meta SubPanelDefinition
     * @param {string} parentModule to use
     * @param {string} parentId to use
     */
    protected initStatistic(statisticKey: string, meta: SubPanelDefinition, parentModule: string, parentId: string): void {
        this.statistics[statisticKey] = this.statisticsStoreFactory.create();

        this.statistics[statisticKey].init(
            meta.module,
            {
                key: statisticKey,
                context: {module: parentModule, id: parentId},
                params: {subpanel: meta.name}
            } as StatisticsQuery,
            false
        );
    }
}
