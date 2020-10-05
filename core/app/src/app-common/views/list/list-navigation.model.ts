import {SortDirection} from '@components/sort-button/sort-button.model';

export interface SortingSelection {
    orderBy?: string;
    sortOrder?: SortDirection;
}

export interface Pagination {
    pageSize: number;
    current: number;
    previous: number;
    next: number;
    last: number;
    pageFirst: number;
    pageLast: number;
    total: number;
}
