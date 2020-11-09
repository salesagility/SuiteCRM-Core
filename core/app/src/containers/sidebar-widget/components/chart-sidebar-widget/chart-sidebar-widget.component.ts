import {Component, OnInit} from '@angular/core';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';
import {ChartMetadata, ChartsWidgetOptions} from '@app-common/metadata/charts-widget.metadata';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {StatisticsQuery} from '@app-common/statistics/statistics.model';
import {map, take, tap} from 'rxjs/operators';
import {ChartDataSource} from '@app-common/containers/chart/chart.model';
import {ChartDataStoreFactory} from '@store/chart-data/chart-data.store.factory';
import {ChartDataState, ChartDataStore} from '@store/chart-data/chart-data.store';

interface ChartStatistic {
    key: string;
    chartType: string;
    statisticsType: string;
    labelKey: string;
    store: ChartDataStore;
    reload: boolean;
}

interface CharDataMap {
    [key: string]: ChartDataState;
}

interface ChartStatisticMap {
    [key: string]: ChartStatistic;
}

interface ChartSidebarWidgetState {
    statistics: { [key: string]: ChartDataState };
    appStrings: LanguageStringMap;
}

@Component({
    selector: 'chart-sidebar-widget',
    templateUrl: './chart-sidebar-widget.component.html',
    styleUrls: []
})
export class ChartSidebarWidgetComponent extends BaseWidgetComponent implements OnInit {
    charts: ChartStatisticMap = {};
    titleLabelKey = 'LBL_CHARTS';
    messageLabelKey = 'LBL_CHART_NOT_FOUND';
    selectedChart = '';
    chartType = '';
    vm$: Observable<ChartSidebarWidgetState>;
    loading$: Observable<boolean>;
    appStrings$: Observable<LanguageStringMap>;
    loading = true;
    protected subs: Subscription[] = [];


    constructor(protected language: LanguageStore, protected factory: ChartDataStoreFactory) {
        super();
    }

    ngOnInit(): void {
        this.appStrings$ = this.language.appStrings$;

        if (this.validateConfig() === false) {
            return;
        }

        const options: ChartsWidgetOptions = this.config.options;
        const charts: ChartMetadata[] = options.charts;
        this.setupCharts(charts);
        this.setHeaderTitle(options);
        this.reloadSelectedChart();
        this.setupLoading();
        this.setupVM();
        this.setupReload();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    get configuredCharts(): ChartMetadata[] {
        return this.chartOptions.charts || [];
    }

    get chartOptions(): ChartsWidgetOptions {
        return this.config.options || {};
    }

    isConfigured(): boolean {
        return !!(this.config.options.charts && this.config.options.charts.length);
    }

    getLabelKey(stat: ChartDataState): string {
        const labelKey = stat.statistic.metadata && stat.statistic.metadata.labelKey;
        if (labelKey) {
            return labelKey;
        }

        return this.charts[stat.query.key].labelKey;
    }

    getDataSource(statistics: CharDataMap): ChartDataSource {
        if (!statistics[this.selectedChart]) {
            return null;
        }
        return statistics[this.selectedChart].dataSource;
    }

    protected validateConfig(): boolean {
        if (!this.context || !this.context.module) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_BAD_CONTEXT';
            return false;
        }

        if (!this.config) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_NO_CONFIG';
            return false;
        }

        const options: ChartsWidgetOptions = this.config.options;

        if (!options || !options.charts || !options.charts.length) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_NO_STATISTICS_KEY';
            return false;
        }

        return true;
    }

    protected setupCharts(charts: ChartMetadata[]): void {

        this.selectedChart = '';

        charts.forEach((chart: ChartMetadata) => {

            const key = chart.chartKey || chart.statisticsType || '';

            if (!key) {
                return;
            }

            if (!this.selectedChart) {
                this.selectedChart = key;
                this.chartType = chart.chartType;
            }

            this.buildChartInfo(key, chart);
            this.initChartStore(key, chart);
        });
    }

    protected buildChartInfo(key: string, chart: ChartMetadata): void {
        this.charts[key] = {
            key,
            labelKey: chart.labelKey || '',
            chartType: chart.chartType,
            statisticsType: chart.statisticsType,
            store: this.factory.create(),
            reload: true
        };
    }

    protected initChartStore(key: string, chart: ChartMetadata): void {
        this.charts[key].store.init(
            this.context.module,
            {
                key: chart.statisticsType,
                context: {...this.context}
            } as StatisticsQuery,
            false,
        );
    }


    protected setHeaderTitle(options: ChartsWidgetOptions): void {
        if (!options.headerTitle) {
            return;
        }

        if (!this.charts || !this.charts[this.selectedChart] || !this.charts[this.selectedChart].labelKey) {
            return;
        }

        this.titleLabelKey = this.charts[this.selectedChart].labelKey;
    }

    protected setupLoading(): void {

        const loadings$: Observable<boolean>[] = [];

        Object.keys(this.charts).forEach(key => loadings$.push(this.charts[key].store.loading$));

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

        const statistics$: Observable<ChartDataState>[] = [];

        Object.keys(this.charts).forEach(key => statistics$.push(this.charts[key].store.state$));

        this.vm$ = combineLatest([combineLatest(statistics$), this.language.appStrings$]).pipe(
            map(([statistics, appStrings]) => {
                const statsMap = this.mapChartData(statistics);

                return {
                    statistics: statsMap,
                    appStrings
                };
            })
        );
    }

    protected mapChartData(statistics: ChartDataState[]): CharDataMap {
        const statsMap: CharDataMap = {};

        statistics.forEach((statistic: ChartDataState) => {

            if (!statistic.query.key) {
                return;
            }

            statsMap[statistic.query.key] = statistic;

            this.charts[statistic.query.key].labelKey = this.getLabelKey(statistic);
        });

        return statsMap;
    }

    protected setupReload(): void {
        if (!this.config.reload$) {
            return;
        }

        this.subs.push(this.config.reload$.subscribe(() => {
            if (this.loading === true) {
                return;
            }

            this.loading = true;

            Object.keys(this.charts).forEach(chartKey => {
                this.charts[chartKey].reload = true;
            });

            this.reloadSelectedChart();
        }));

    }

    protected reloadSelectedChart(): void {

        if (!this.charts || !this.charts[this.selectedChart] || !this.charts[this.selectedChart].store) {
            return;
        }

        this.charts[this.selectedChart].store.load(false).pipe(
            take(1),
            tap(() => {
                this.charts[this.selectedChart].reload = false;
            })
        ).subscribe();
    }
}
