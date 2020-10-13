export interface StatisticsQueryMap {
    [key: string]: StatisticsQuery;
}

export interface StatisticsQuery {
    key: string;
    params: any;
}

export interface StatisticsMap {
    [key: string]: Statistic;
}

export interface Statistic {
    id: string;
    data: any;
}

export interface SubpanelStatisticsData {
    type: string;
    value: string;
}

export interface SubpanelStatistic extends Statistic {
    id: string;
    data: SubpanelStatisticsData;
}
