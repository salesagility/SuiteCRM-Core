import {Observable} from 'rxjs';


export interface LineChartSeriesEntry {
    name: string;
    value: number;
    min?: number;
    max?: number;
}


export interface LineChartResult {
    name: string;
    series: LineChartSeriesEntry[];
}

export interface LineChartDataSource {
    height?: number;
    scheme: any;
    gradient: any;
    xAxis: any;
    yAxis: any;
    legend: any;
    showXAxisLabel: any;
    showYAxisLabel: any;
    xAxisLabel: any;
    yAxisLabel: any;
    xScaleMin: any;
    xScaleMax: any;
    xAxisTicks: any[];

    getResults(): Observable<LineChartResult[]>;
}
