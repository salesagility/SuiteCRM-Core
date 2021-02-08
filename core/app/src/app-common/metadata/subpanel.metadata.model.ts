import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {WidgetOptionMap} from '@app-common/metadata/widget.metadata';

export interface SubPanelTopButton {
    key: string;
    labelKey: string;
    module: string;
}

export interface SubPanelCollectionList {
    [key: string]: SubPanelCollectionItem;
}

/* eslint-disable camelcase */
export interface SubPanelCollectionItem {
    module: string;
    subpanel_name: string;
    get_subpanel_data: string;
}

/* eslint-enable camelcase */

export interface SubPanelMeta {
    [key: string]: SubPanel;
}

/* eslint-disable camelcase */
export interface SubPanel {
    insightWidget?: WidgetOptionMap;
    order?: 10;
    sort_order?: string;
    sort_by?: string;
    title_key?: string;
    type?: string;
    name: string;
    subpanel_name?: string;
    header_definition_from_subpanel?: string;
    module?: string;
    legacyModule?: string;
    headerModule?: string;
    top_buttons?: SubPanelTopButton[];
    collection_list: SubPanelCollectionList;
    columns: ColumnDefinition[];
    icon?: string;
}

/* eslint-enable camelcase */

