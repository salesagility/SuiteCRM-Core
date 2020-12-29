import {ViewMode} from '@app-common/views/view.model';

export interface FormatOptions {
    [key: string]: any;

    mode?: ViewMode;
}

export interface Formatter {
    toUserFormat(value: string, options?: FormatOptions): string;

    toInternalFormat(value: string): string;
}
