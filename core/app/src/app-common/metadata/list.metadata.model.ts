import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {BulkActionsMap} from '@app-common/actions/bulk-action.model';
import {LineAction} from '@app-common/actions/line-action.model';
import {ChartTypesMap} from '@app-common/containers/chart/chart.model';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {FieldDefinition} from '@app-common/record/field.model';

export interface ListViewMeta {
    fields: ColumnDefinition[];
    bulkActions: BulkActionsMap;
    lineActions: LineAction[];
    chartTypes: ChartTypesMap;
    sidebarWidgets?: WidgetMetadata[];
    filters: Filter[];
}

export interface Filter {
    id: string;
    name: string;
    contents: { [key: string]: any };
}

export interface ColumnDefinition extends ViewFieldDefinition {
    width: string;
    default: boolean;
    module: string;
    id: string;
    sortable: boolean;
}

export interface SearchMetaField {
    name?: string;
    type?: string;
    label?: string;
    default?: boolean;
    options?: string;
    fieldDefinition?: FieldDefinition;
}

export interface SearchMeta {
    layout: {
        basic?: { [key: string]: SearchMetaField };
        advanced?: { [key: string]: SearchMetaField };
    };
}

