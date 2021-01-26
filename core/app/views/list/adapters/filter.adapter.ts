import {Injectable} from '@angular/core';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {Metadata} from '@store/metadata/metadata.store.service';
import {FilterConfig} from '@components/list-filter/list-filter.model';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {SearchMetaFieldMap} from '@app-common/metadata/list.metadata.model';
import {map} from 'rxjs/operators';

@Injectable()
export class FilterAdapter {

    constructor(protected store: ListViewStore) {
    }

    getConfig(): FilterConfig {
        return {

            module: this.store.getModuleName(),
            criteria$: this.store.criteria$,
            searchFields$: this.store.metadata$.pipe(
                map((meta: Metadata) => {

                    if (!meta || !meta.search) {
                        return {} as SearchMetaFieldMap;
                    }

                    const searchMeta = meta.search;

                    let type = 'advanced';
                    if (!searchMeta.layout.advanced) {
                        type = 'basic';
                    }

                    return searchMeta.layout[type];
                })
            ),

            onClose: (): void => {
                this.store.showFilters = false;
            },

            onSearch: (): void => {
                this.store.showFilters = false;
            },

            updateSearchCriteria: (criteria: SearchCriteria, reload = true): void => {
                this.store.updateSearchCriteria(criteria, reload);
            }
        } as FilterConfig;
    }
}
