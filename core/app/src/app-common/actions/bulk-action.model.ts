export interface BulkAction {
    key: string;
    labelKey: string;
    params: { [key: string]: any };
    acl: string[];
}

export interface BulkActionsMap {
    [key: string]: BulkAction;
}
