import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {TableConfig} from '@components/table/table.model';
import {ListViewStore} from '../store/list-view/list-view.store';

@Injectable()
export class TableAdapter {

    constructor(
        protected store: ListViewStore,
        protected metadata: MetadataStore,
    ) {
    }

    getTable(): TableConfig {
        return {
            showHeader: true,
            showFooter: true,

            module: this.store.getModuleName(),

            columns: this.store.columns$,
            lineActions$: this.store.lineActions$,
            selection$: this.store.selection$,
            sort$: this.store.sort$,
            maxColumns$: of(4),

            dataSource: this.store.recordList,
            selection: this.store.recordList,
            bulkActions: this.store,
            pagination: this.store.recordList,

            toggleRecordSelection: (id: string): void => {
                this.store.recordList.toggleSelection(id);
            },

            updateSorting: (orderBy: string, sortOrder: SortDirection): void => {
                this.store.recordList.updateSorting(orderBy, sortOrder);
                this.store.updateLocalStorage();
            },
        } as TableConfig;
    }
}
