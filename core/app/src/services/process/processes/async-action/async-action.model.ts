export interface AsyncActionData {
    [key: string]: any;
}

export abstract class AsyncActionHandler {
    abstract key: string;

    abstract run(data: AsyncActionData): void;
}
