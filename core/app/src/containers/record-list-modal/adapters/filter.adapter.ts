import {Injectable} from '@angular/core';
import {FilterConfig} from '@components/list-filter/list-filter.model';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {SearchMeta, SearchMetaFieldMap} from '@app-common/metadata/list.metadata.model';
import {map} from 'rxjs/operators';
import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {RecordListModalFilterAdapterInterface} from '@containers/record-list-modal/adapters/adapter.model';

@Injectable()
export class ModalRecordFilterAdapter implements RecordListModalFilterAdapterInterface {

    getConfig(store: RecordListModalStore): FilterConfig {
        return {
            klass: 'light-filter',
            panelMode: 'collapsible',
            isCollapsed: true,
            collapseOnSearch: true,
            module: store.recordList.getModule(),
            criteria$: store.recordList.criteria$,
            searchFields$: store.searchMetadata$.pipe(
                map((searchMeta: SearchMeta) => {

                    if (!searchMeta) {
                        return {} as SearchMetaFieldMap;
                    }

                    let type = 'advanced';
                    if (!searchMeta.layout.advanced) {
                        type = 'basic';
                    }

                    return searchMeta.layout[type];
                })
            ),

            onClose: (): void => {
            },

            onSearch: (): void => {
            },

            updateSearchCriteria: (criteria: SearchCriteria, reload = true): void => {
                store.recordList.updateSearchCriteria(criteria, reload);
            }
        } as FilterConfig;
    }
}
