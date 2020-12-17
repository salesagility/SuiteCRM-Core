import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {deepClone} from '@base/app-common/utils/object-utils';
import {SeriesStatistic, Statistic, StatisticsQuery} from '@app-common/statistics/statistics.model';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {ChartDataSource, ChartOptionMap, SeriesResult} from '@app-common/containers/chart/chart.model';
import {SeriesStatisticsState, SeriesStatisticsStore} from '@store/series-statistics/series-statistics.store';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {ChartOptions} from '@app-common/metadata/charts-widget.metadata';

const initialState = {
    module: '',
    query: {} as StatisticsQuery,
    statistic: {
        id: '',
        data: {} as SeriesResult
    } as SeriesStatistic,
    loading: false
} as ChartDataState;

export interface ChartDataState extends SeriesStatisticsState {
    dataSource?: ChartDataSource;
}

@Injectable()
export class ChartDataStore extends SeriesStatisticsStore {

    state$: Observable<ChartDataState>;
    statistic$: Observable<SeriesStatistic>;
    loading$: Observable<boolean>;
    protected internalState: ChartDataState = deepClone(initialState);
    protected store = new BehaviorSubject<ChartDataState>(this.internalState);
    protected defaultOptions: ChartOptions = {};

    constructor(
        protected fetchGQL: StatisticsFetchGQL,
        protected formatter: DataTypeFormatter
    ) {
        super(fetchGQL);
        this.state$ = this.store.asObservable();
        this.statistic$ = this.state$.pipe(map(state => state.statistic), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
    }

    public setDefaultOptions(chartOptions: ChartOptions): void {
        this.defaultOptions = chartOptions;
    }

    protected addNewState(statistic: Statistic): void {

        if (!statistic.metadata || !statistic.metadata.dataType) {
            return;
        }
        this.injectDefaultValues(statistic);

        const dataSource = this.buildCharDataSource(statistic);

        this.updateState({
            ...this.internalState,
            statistic,
            dataSource,
            loading: false
        });
    }

    protected injectDefaultValues(statistic: Statistic): void {
        if (!statistic.metadata.chartOptions) {
            statistic.metadata.chartOptions = deepClone(this.defaultOptions);
            return;
        }

        Object.keys(this.defaultOptions).forEach(optionKey => {
            if (!(optionKey in statistic.metadata.chartOptions)) {
                statistic.metadata.chartOptions[optionKey] = this.defaultOptions[optionKey];
            }
        });
    }

    protected buildCharDataSource(statistic: Statistic): ChartDataSource {
        const dataType = statistic.metadata.dataType || '';

        const digits = (statistic.metadata && statistic.metadata.digits) || 0;
        const formatOptions = {
            digits
        };

        return {
            options: statistic.metadata.chartOptions || {} as ChartOptionMap,

            getResults: (): Observable<SeriesResult> => of(this.buildSeriesResult(statistic)).pipe(shareReplay(1)),
            tickFormatting: (value: any): any => this.formatter.toUserFormat(dataType, value, formatOptions),
            tooltipFormatting: (value: any): any => this.formatter.toUserFormat(dataType, value, formatOptions)
        } as ChartDataSource;
    }

    protected buildSeriesResult(statistic: Statistic): SeriesResult {

        const result = {} as SeriesResult;

        const singleSeries = statistic.data.singleSeries || null;
        if (singleSeries) {
            result.singleSeries = singleSeries;
        }

        const multiSeries = statistic.data.multiSeries || null;
        if (multiSeries) {
            result.multiSeries = multiSeries;
        }

        return result;
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: ChartDataState): void {
        super.updateState(state);
    }
}
