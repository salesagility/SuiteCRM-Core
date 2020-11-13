import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';
import {
    SingleValueStatisticsState,
    SingleValueStatisticsStore
} from '@store/single-value-statistics/single-value-statistics.store';
import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';
import {map, take} from 'rxjs/operators';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {StatisticsQuery} from '@app-common/statistics/statistics.model';
import {
    ContentAlign,
    ContentJustify,
    StatisticWidgetLayoutRow,
    StatisticWidgetOptions,
    TextColor,
    TextSizes
} from '@app-common/metadata/widget.metadata';
import {ViewContext} from '@app-common/views/view.model';
import {isTrue} from '@app-common/utils/value-utils';

interface StatisticsTopWidgetState {
    statistics: { [key: string]: SingleValueStatisticsState };
    appStrings: LanguageStringMap;
}

interface StatisticsEntry {
    labelKey?: string;
    type: string;
    store: SingleValueStatisticsStore;
}

interface StatisticsEntryMap {
    [key: string]: StatisticsEntry;
}

@Component({
    selector: 'scrm-statistics-sidebar-widget',
    templateUrl: './statistics-sidebar-widget.component.html',
    styles: []
})
export class StatisticsSidebarWidgetComponent extends BaseWidgetComponent implements OnInit, OnDestroy {

    options: StatisticWidgetOptions;
    statistics: StatisticsEntryMap = {};
    vm$: Observable<StatisticsTopWidgetState>;
    messageLabelKey: string;
    loading$: Observable<boolean>;
    appStrings$: Observable<LanguageStringMap>;
    loading = true;
    protected subs: Subscription[] = [];

    constructor(
        protected language: LanguageStore,
        protected factory: SingleValueStatisticsStoreFactory
    ) {
        super();
    }


    ngOnInit(): void {

        this.appStrings$ = this.language.appStrings$;

        if (!this.context || !this.context.module) {
            this.messageLabelKey = 'LBL_CONFIG_BAD_CONTEXT';
            return;
        }

        if (!this.config) {
            this.messageLabelKey = 'LBL_CONFIG_NO_CONFIG';
            return;
        }

        if (!this.config.options || !this.config.options.sidebarStatistic || !this.config.options.sidebarStatistic.rows) {
            this.messageLabelKey = 'LBL_CONFIG_NO_STATISTICS_KEY';
            return;
        }

        this.options = this.config.options.sidebarStatistic;

        this.buildStatistics();

        this.setupLoading$();
        this.setupVM();
        this.setupReload();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getHeaderLabel(): string {
        return this.getLabel(this.config.labelKey) || '';
    }

    getLayout(): StatisticWidgetLayoutRow[] {
        return this.options.rows;
    }

    getLabelKey(stat: SingleValueStatisticsState): string {
        const labelKey = stat.statistic.metadata && stat.statistic.metadata.labelKey;
        if (labelKey) {
            return labelKey;
        }

        return this.statistics[stat.query.key].labelKey;
    }

    getLabel(key: string): string {
        const context = this.context || {} as ViewContext;
        const module = context.module || '';

        return this.language.getFieldLabel(key, module);
    }

    getSizeClass(size: TextSizes): string {
        const sizeMap = {
            regular: 'text-regular',
            medium: 'text-medium',
            large: 'text-large',
            'x-large': 'text-x-large',
            'xx-large': 'text-xx-large',
            huge: 'text-huge'
        };

        return sizeMap[size] || 'text-regular';
    }

    getFontWeight(bold: string | boolean): string {
        let fontWeight = 'font-weight-normal';

        if (bold && isTrue(bold)) {
            fontWeight = 'font-weight-bolder';
        }

        return fontWeight;
    }

    getColor(color: TextColor): string {
        const sizeMap = {
            yellow: 'text-yellow',
            blue: 'text-blue',
            green: 'text-green',
            red: 'text-red',
            purple: 'text-purple',
            dark: 'text-dark',
            grey: 'text-grey'
        };

        return sizeMap[color] || '';
    }

    getJustify(justify: ContentJustify): string {
        const justifyMap = {
            start: 'justify-content-start',
            end: 'justify-content-end',
            center: 'justify-content-center',
            between: 'justify-content-between',
            around: 'justify-content-around'
        };

        return justifyMap[justify] || 'justify-content-center';
    }

    getAlign(align: ContentAlign): string {
        const alignMap = {
            start: 'align-items-start',
            end: 'align-items-end',
            center: 'align-items-center',
            baseline: 'align-items-baseline',
            stretch: 'align-items-stretch'
        };

        return alignMap[align] || 'align-items-center';
    }

    protected buildStatistics(): void {
        this.options.rows.forEach(row => {

            if (!row.cols || !row.cols.length) {
                return;
            }

            row.cols.forEach(col => {

                if (!col.statistic) {
                    return;
                }

                this.statistics[col.statistic] = {
                    type: col.statistic,
                    store: this.factory.create()
                };

                this.statistics[col.statistic].store.init(
                    this.context.module,
                    {
                        key: col.statistic,
                        context: {...this.context}
                    } as StatisticsQuery,
                ).pipe(take(1)).subscribe();
            });
        });
    }

    protected setupLoading$(): void {

        const loadings$: Observable<boolean>[] = [];
        Object.keys(this.statistics).forEach(type => loadings$.push(this.statistics[type].store.loading$));

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
    }

    protected setupVM(): void {
        const statistics$: Observable<SingleValueStatisticsState>[] = [];

        Object.keys(this.statistics).forEach(type => statistics$.push(this.statistics[type].store.state$));
        this.vm$ = combineLatest([combineLatest(statistics$), this.language.appStrings$]).pipe(
            map(([statistics, appStrings]) => {
                const statsMap: { [key: string]: SingleValueStatisticsState } = {};
                statistics.forEach(value => {
                    statsMap[value.query.key] = value;

                    this.statistics[value.query.key].labelKey = this.getLabelKey(value);
                });

                return {
                    statistics: statsMap,
                    appStrings
                };
            })
        );
    }

    protected setupReload(): void {
        if (this.config.reload$) {
            this.subs.push(this.config.reload$.subscribe(() => {
                if (this.loading === false) {

                    this.loading = true;
                    Object.keys(this.statistics).forEach(statisticKey => {
                        const statistic = this.statistics[statisticKey];

                        if (!statistic.store) {
                            return;
                        }

                        statistic.store.load(false).pipe(take(1)).subscribe();
                    });
                }
            }));
        }
    }
}
