import {Observable} from 'rxjs';
import {SearchMetaFieldMap} from '@app-common/metadata/list.metadata.model';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';

export interface FilterConfig {

    module: string;
    criteria$: Observable<SearchCriteria>;
    searchFields$: Observable<SearchMetaFieldMap>;
    panelMode?: 'collapsible' | 'closable' | 'none';
    isCollapsed?: boolean;

    onClose(): void;

    onSearch(): void;

    updateSearchCriteria(criteria: SearchCriteria, reload?: boolean): void;
}
