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
