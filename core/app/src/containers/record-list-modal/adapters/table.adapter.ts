import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {TableConfig} from '@components/table/table.model';
import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';

@Injectable()
export class ModalRecordListTableAdapter {

    constructor(protected store: RecordListModalStore) {
    }

    getTable(): TableConfig {
        return {
            showHeader: true,
            showFooter: true,

            module: this.store.recordList.getModule(),

            columns: this.store.columns$,
            sort$: this.store.recordList.sort$,
            maxColumns$: of(5),
            loading$: this.store.recordList.loading$,

            dataSource: this.store.recordList,
            pagination: this.store.recordList,

            toggleRecordSelection: (id: string): void => {
                this.store.recordList.toggleSelection(id);
            },

            updateSorting: (orderBy: string, sortOrder: SortDirection): void => {
                this.store.recordList.updateSorting(orderBy, sortOrder);
            },
        } as TableConfig;
    }
}
