import {ViewContext} from '@app-common/views/view.model';

export interface StatisticsQueryMap {
    [key: string]: StatisticsQuery;
}

export interface StatisticsQuery {
    key: string;
    params: any;
    context: ViewContext;
}

export interface StatisticsMap {
    [key: string]: Statistic;
}

export interface Statistic {
    id: string;
    data: any;
    metadata?: StatisticMetadata;
}

export interface StatisticMetadata {
    [key: string]: any;

    type: string;
    labelKey?: string;
}

export interface SingleValueStatisticsData {
    type: string;
    value: string;
}

export interface SingleValueStatistic extends Statistic {
    id: string;
    data: SingleValueStatisticsData;
    metadata?: StatisticMetadata;
}
