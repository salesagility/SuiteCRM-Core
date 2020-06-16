export interface FieldMetadata {
    format?: boolean;
    target?: string;
}

export interface Field {
    type: string;
    value: string;
    name?: string;
    metadata?: FieldMetadata;
}
