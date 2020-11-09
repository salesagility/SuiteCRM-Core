export interface FormatOptions {
    [key: string]: any;
}

export interface Formatter {
    toUserFormat(value: string, options?: FormatOptions): string;
}
