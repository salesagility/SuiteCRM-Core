import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsMap, StatisticsQueryMap} from '@app-common/statistics/statistics.model';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {ChartDataStoreFactory} from '@store/chart-data/chart-data.store.factory';
import {dataTypeFormatterMock} from '@services/formatters/data-type.formatter.spec.mock';

class StatisticsFetchGQLSpy extends StatisticsFetchGQL {
    constructor() {
        super(null);
    }

    public fetch(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        module: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        queries: StatisticsQueryMap,
    ): Observable<StatisticsMap> {
        return of({
            'accounts-past-years-closed-opportunity-amounts': {
                id: 'accounts-past-years-closed-opportunity-amounts',
                data: {
                    multiSeries: [
                        {
                            name: 'Closed Won',
                            series: [
                                {
                                    name: '2016',
                                    value: '0',
                                    extra: null,
                                    min: null,
                                    max: null,
                                    label: null
                                },
                                {
                                    name: '2017',
                                    value: '0',
                                    extra: null,
                                    min: null,
                                    max: null,
                                    label: null
                                },
                                {
                                    name: '2018',
                                    value: '0',
                                    extra: null,
                                    min: null,
                                    max: null,
                                    label: null
                                },
                                {
                                    name: '2019',
                                    value: '0',
                                    extra: null,
                                    min: null,
                                    max: null,
                                    label: null
                                },
                                {
                                    name: '2020',
                                    value: '400',
                                    extra: null,
                                    min: null,
                                    max: null,
                                    label: null
                                }
                            ]
                        }
                    ]
                },
                metadata: {
                    type: 'series-statistic',
                    dataType: 'currency',
                    chartOptions: {
                        height: null,
                        scheme: null,
                        gradient: null,
                        xAxis: null,
                        yAxis: null,
                        legend: true,
                        showXAxisLabel: null,
                        showYAxisLabel: null,
                        xAxisLabel: null,
                        yAxisLabel: null,
                        xScaleMin: '2016',
                        xScaleMax: '2020',
                        xAxisTicks: [
                            '2016',
                            '2017',
                            '2018',
                            '2019',
                            '2020'
                        ],
                        yAxisTickFormatting: true,
                        xAxisTickFormatting: null,
                        tooltipDisabled: true
                    }
                }
            }
        }).pipe(shareReplay(1));
    }
}

export const chartDataStoreFactoryMock = new ChartDataStoreFactory(
    new StatisticsFetchGQLSpy(),
    dataTypeFormatterMock
);
