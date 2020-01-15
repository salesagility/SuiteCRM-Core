export interface ListViewColumnModel {
    key: string;
    audited: boolean;
    comment: string;
    dbType: string;
    default: boolean;
    fullTextSearch: {
        boost: number;
    };
    importable: string;
    label: string;
    len: number;
    link: boolean;
    mergeFilter: string;
    name: string;
    required: boolean;
    type: string;
    unifiedSearch: boolean;
    vname: string;
    width: number;
}
