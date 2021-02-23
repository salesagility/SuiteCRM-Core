import {Observable} from 'rxjs';

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
}

export interface StatisticWidgetLayoutCol {
    iconClass?: string;
    icon?: string;
    labelKey?: string;
    dynamicLabel?: string;
    statistic?: string;
    display?: string;
    size?: TextSizes;
    color?: TextColor;
    bold?: boolean | string;
    class?: string;
}
