export type ViewMode = 'detail' | 'edit' | 'list';

export interface ViewContext {
    module: string;
    id?: string;
}

