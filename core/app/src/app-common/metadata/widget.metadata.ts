import {Observable} from 'rxjs';
import {SingleValueStatisticsStoreInterface} from '../statistics/statistics-store.model';

export interface WidgetMetadata {
    type: string;
    labelKey?: string;
    options: WidgetOptionMap;
    reload$?: Observable<boolean>;
    refreshOnRecordUpdate?: boolean;
}

export interface WidgetOptionMap {
    [key: string]: any;
}

export interface StatisticWidgetOptions {
    rows: StatisticWidgetLayoutRow[];
}

export type TextSizes = 'regular' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'huge' | string;
export type ContentJustify = 'start' | 'end' | 'center' | 'between' | 'around' | string;
export type ContentAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | string;
export type TextColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'dark' | 'grey' | string;

export interface StatisticWidgetLayoutRow {
    justify?: ContentJustify;
    align?: ContentAlign;
    cols: StatisticWidgetLayoutCol[];
    class?: string;
}

export interface StatisticWidgetLayoutCol {
    iconClass?: string;
    icon?: string;
    labelKey?: string;
    descriptionKey?: string;
    dynamicLabel?: string;
    statistic?: string;
    store?: SingleValueStatisticsStoreInterface;
    display?: string;
    size?: TextSizes;
    color?: TextColor;
    bold?: boolean | string;
    class?: string;
}
