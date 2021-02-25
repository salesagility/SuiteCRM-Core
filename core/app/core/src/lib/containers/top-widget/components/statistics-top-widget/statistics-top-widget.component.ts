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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseWidgetComponent} from '../../../widgets/base-widget.model';
import {SingleValueStatisticsStore} from '../../../../store/single-value-statistics/single-value-statistics.store';
import {SingleValueStatisticsStoreFactory} from '../../../../store/single-value-statistics/single-value-statistics.store.factory';
import {map, take} from 'rxjs/operators';
import {LanguageStore, LanguageStringMap} from '../../../../store/language/language.store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {StatisticsQuery} from 'common';
import {ViewContext} from 'common';
import {SingleValueStatisticsState} from 'common';

interface StatisticsTopWidgetState {
    statistics: { [key: string]: SingleValueStatisticsState };
    appStrings: LanguageStringMap;
}

interface StatisticsEntry {
    labelKey: string;
    endLabelKey?: string;
    type: string;
    store: SingleValueStatisticsStore;
}

interface StatisticsEntryMap {
    [key: string]: StatisticsEntry;
}

@Component({
    selector: 'scrm-statistics-top-widget',
    templateUrl: './statistics-top-widget.component.html',
    styles: []
})
export class StatisticsTopWidgetComponent extends BaseWidgetComponent implements OnInit, OnDestroy {
    statistics: StatisticsEntryMap = {};
    vm$: Observable<StatisticsTopWidgetState>;
    messageLabelKey: string;
    loading$: Observable<boolean>;
    protected loading = true;
    protected subs: Subscription[] = [];

    constructor(
        protected language: LanguageStore,
        protected factory: SingleValueStatisticsStoreFactory
    ) {
        super();
    }


    ngOnInit(): void {

        if (!this.context || !this.context.module) {
            this.messageLabelKey = 'LBL_CONFIG_BAD_CONTEXT';
            return;
        }

        if (!this.config) {
            this.messageLabelKey = 'LBL_CONFIG_NO_CONFIG';
            return;
        }

        if (!this.config.options || !this.config.options.statistics || !this.config.options.statistics.length) {
            this.messageLabelKey = 'LBL_CONFIG_NO_STATISTICS_KEY';
            return;
        }

        if (this.context$) {
            this.subs.push(this.context$.subscribe((context: ViewContext) => {
                this.context = context;
            }));
        }

        const statistics$: Observable<SingleValueStatisticsState>[] = [];
        const loadings$: Observable<boolean>[] = [];
        this.config.options.statistics.forEach(statistic => {

            if (!statistic.type) {
                return;
            }

            this.statistics[statistic.type] = {
                labelKey: statistic.labelKey || '',
                endLabelKey: statistic.endLabelKey || '',
                type: statistic.type,
                store: this.factory.create()
            };

            this.statistics[statistic.type].store.init(
                this.context.module,
                {
                    key: statistic.type,
                    context: {...this.context}
                } as StatisticsQuery,
            ).pipe(take(1)).subscribe();

            statistics$.push(this.statistics[statistic.type].store.state$);
            loadings$.push(this.statistics[statistic.type].store.loading$);
        });

        this.loading$ = combineLatest(loadings$).pipe(map((loadings) => {

            if (!loadings || loadings.length < 1) {
                this.loading = false;
                return false;
            }

            let loading = true;

            loadings.forEach(value => {
                loading = loading && value;
            });

            this.loading = loading;

            return loading;
        }));

        this.subs.push(this.loading$.subscribe());

        this.vm$ = combineLatest([combineLatest(statistics$), this.language.appStrings$]).pipe(
            map(([statistics, appStrings]) => {
                const statsMap: { [key: string]: SingleValueStatisticsState } = {};
                statistics.forEach(value => {
                    statsMap[value.query.key] = value;

                    this.statistics[value.query.key].labelKey = this.getMetadataEntry(value, 'labelKey');
                    this.statistics[value.query.key].endLabelKey = this.getMetadataEntry(value, 'endLabelKey');
                });

                return {
                    statistics: statsMap,
                    appStrings
                };
            })
        );

        if (this.config.reload$) {
            this.subs.push(this.config.reload$.subscribe(() => {
                if (this.loading === false) {

                    this.loading = true;
                    this.config.options.statistics.forEach(statistic => {

                        if (!statistic.type) {
                            return;
                        }

                        if (!this.statistics[statistic.type] || !this.statistics[statistic.type].store) {
                            return;
                        }

                        this.statistics[statistic.type].store.load(false).pipe(take(1)).subscribe();
                    });

                }
            }));
        }


    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getMetadataEntry(stat: SingleValueStatisticsState, name: string): string {
        const value = stat.statistic.metadata && stat.statistic.metadata[name];
        if (value !== null && typeof value !== 'undefined') {
            return value;
        }

        return this.statistics[stat.query.key][name];
    }

    getLabel(key: string): string {
        const context = this.context || {} as ViewContext;
        const module = context.module || '';

        return this.language.getFieldLabel(key, module);
    }


}
