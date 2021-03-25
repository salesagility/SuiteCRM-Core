import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {SortingSelection} from '@app-common/views/list/list-navigation.model';

export type ViewMode = 'detail' | 'edit' | 'list' | 'create';

export interface ViewContext {
    module: string;
    id?: string;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
}

