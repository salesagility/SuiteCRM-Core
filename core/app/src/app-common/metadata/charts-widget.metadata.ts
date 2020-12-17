export interface ChartOptions {
    [key: string]: string;
}

export interface ChartMetadata {
    chartKey?: string;
    chartType?: string;
    statisticsType?: string;
    labelKey?: string;
    chartOptions?: ChartOptions;
}

export interface ChartsWidgetOptions {
    charts?: ChartMetadata[];
    toggle?: boolean;
    headerTitle?: boolean;
    defaultChart?: string;
}
