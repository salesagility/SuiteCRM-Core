export interface WidgetMetadata {
    type: string;
    labelKey?: string;
    options: WidgetOptionMap;
}

export interface WidgetOptionMap {
    [key: string]: any;
}
