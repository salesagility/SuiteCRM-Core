import {Observable} from 'rxjs';

export interface DataItem {
    name: string | number | Date;
    value: string | number | Date;
    extra?: any;
    min?: number;
    max?: number;
    label?: string;
}

export type SingleSeries = Array<DataItem>;

export interface Series {
    name: string | number | Date;
    series: DataItem[];
}

export type MultiSeries = Array<Series>;


export interface NumberDataItem extends DataItem {
    name: string;
    value: number;
}

export interface NumberSeries extends Series {
    name: string;
    series: NumberDataItem[];
}

export type NumberMultiSeries = Array<NumberSeries>;


export interface SeriesResult {
    singleSeries?: SingleSeries;
    multiSeries?: MultiSeries;
}

export interface ChartOptionMap {
    [key: string]: any;

    height?: number;
    scheme?: any;
    gradient?: any;
    xAxis?: any;
    yAxis?: any;
    legend?: any;
    showXAxisLabel?: any;
    showYAxisLabel?: any;
    xAxisLabel?: any;
    yAxisLabel?: any;
    xScaleMin?: number | string;
    xScaleMax?: number | string;
    xAxisTicks?: any[];
    yAxisTickFormatting?: boolean;
    xAxisTickFormatting?: boolean;
    tooltipDisabled?: boolean;
}

export interface ChartDataSource {
    options: ChartOptionMap;
    tickFormatting?: Function;

    getResults(): Observable<SeriesResult>;

    tooltipFormatting(value: any): any;
}

export interface ChartType {
    key: string;
    labelKey: string;
    type: string;
}

export interface ChartTypesMap {
    [key: string]: ChartType;
}
