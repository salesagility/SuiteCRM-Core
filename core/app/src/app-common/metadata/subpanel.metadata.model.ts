
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';

export interface SubPanelTopButton {
    key: string;
    labelKey: string;
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
    order?: 10;
    sort_order?: string;
    sort_by?: string;
    title_key?: string;
    type?: string;
    subpanel_name?: string;
    header_definition_from_subpanel?: string;
    module?: string;
    headerModule?: string;
    top_buttons?: SubPanelTopButton[];
    collection_list: SubPanelCollectionList;
    columns: ColumnDefinition[];
    icon?: string;
}
/* eslint-enable camelcase */

