import {Observable} from 'rxjs';

export interface VerticalBarChartResult {
    name: string;
    value: number;
}

export interface VerticalBarChartDataSource {
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
    tickFormatting: Function;

    getResults(): Observable<VerticalBarChartResult[]>;

    tooltipFormatting(value: any): any;
}
