export interface FieldMap {
    [key: string]: any;
}

export interface Record {
    type: string;
    module: string;
    attributes: FieldMap;
    id?: string;
}
