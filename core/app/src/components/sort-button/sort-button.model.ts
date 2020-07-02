import {Observable} from 'rxjs';

export enum SortDirection {
    NONE = 'NONE',
    ASC = 'ASC',
    DESC = 'DESC'
}

export interface SortDirectionDataSource {
    getSortDirection(): Observable<SortDirection>;

    changeSortDirection(direction: SortDirection): void;
}
