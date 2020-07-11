export interface BulkActionHandlerData {
    [key: string]: any;
}

export abstract class BulkActionHandler {
    abstract key: string;

    abstract run(data: BulkActionHandlerData): void;
}
