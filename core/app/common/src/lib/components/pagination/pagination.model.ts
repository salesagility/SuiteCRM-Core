import {Observable} from 'rxjs';
import {PageSelection, PaginationCount} from '../../views/list';

export interface PaginationDataSource {
    getPaginationCount(): Observable<PaginationCount>;
    changePage(page: PageSelection): void;
}
