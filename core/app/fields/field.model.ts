export interface FieldMetadata {
    format?: boolean;
    target?: string;
}

export interface Field {
    type: string;
    value: string;
    name?: string;
    label?: string;
    labelKey?: string;
    metadata?: FieldMetadata;
}
