export interface ChartMetadata {
    chartKey?: string;
    chartType?: string;
    statisticsType?: string;
    labelKey?: string;
}

export interface ChartsWidgetOptions {
    charts?: ChartMetadata[];
    toggle?: boolean;
    headerTitle?: boolean;
}
