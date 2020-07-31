import {Observable} from 'rxjs';

export interface LineChartResult {
    name: string;
    value: number;
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

    getResults(): Observable<LineChartResult[]>;
}
