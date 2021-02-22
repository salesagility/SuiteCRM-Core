import {Observable} from 'rxjs';
import {PageSelection, PaginationCount} from '../../views/list/list-navigation.model';

export interface PaginationDataSource {
    getPaginationCount(): Observable<PaginationCount>;

    changePage(page: PageSelection): void;
}
