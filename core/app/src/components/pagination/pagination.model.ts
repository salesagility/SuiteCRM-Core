import {Observable} from 'rxjs';

export interface PaginationCount {
    pageFirst: number;
    pageLast: number;
    total: number;
}

export enum PageSelection {
    FIRST = 'FIRST',
    PREVIOUS = 'PREVIOUS',
    NEXT = 'NEXT',
    LAST = 'LAST',
}

export interface PaginationDataSource {
    getPaginationCount(): Observable<PaginationCount>;
    changePage(page: PageSelection): void;
}
