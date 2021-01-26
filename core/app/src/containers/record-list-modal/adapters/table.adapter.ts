import {of} from 'rxjs';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {TableConfig} from '@components/table/table.model';
import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {map} from 'rxjs/operators';
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {Record} from '@app-common/record/record.model';
import {Field} from '@app-common/record/field.model';
import {RecordListModalTableAdapterInterface} from '@containers/record-list-modal/adapters/adapter.model';

export class ModalRecordListTableAdapter implements RecordListModalTableAdapterInterface {

    /**
     * Get table config
     *
     * @param {object} store to use
     * @returns {object} TableConfig
     */
    getTable(store: RecordListModalStore): TableConfig {
        return {
            showHeader: true,
            showFooter: true,

            module: store.recordList.getModule(),

            columns: store.columns$.pipe(map(columns => this.mapColumns(store, columns))),
            sort$: store.recordList.sort$,
            maxColumns$: of(5),
            loading$: store.recordList.loading$,

            dataSource: store.recordList,
            pagination: store.recordList,

            toggleRecordSelection: (id: string): void => {
                store.recordList.toggleSelection(id);
            },

            updateSorting: (orderBy: string, sortOrder: SortDirection): void => {
                store.recordList.updateSorting(orderBy, sortOrder);
            },
        } as TableConfig;
    }

    /**
     * Parse and override column definitions
     *
     * @param {object} store to use
     * @param {[]} columns to map
     * @returns {[]} ColumnDefinition[]
     */
    protected mapColumns(store: RecordListModalStore, columns: ColumnDefinition[]): ColumnDefinition[] {
        const mappedColumns = [];

        columns.forEach(column => {
            const mapped = {...column};
            const metadata = column.metadata || {};
            mapped.metadata = {...metadata};

            this.disableRelateFieldsLink(mapped);
            this.addLinkSelectHandler(store, mapped);

            mappedColumns.push(mapped);
        });

        return mappedColumns;
    }

    /**
     * Disable link for relate fields
     *
     * @param {object} definition to update
     */
    protected disableRelateFieldsLink(definition: ColumnDefinition): void {
        if (definition.type !== 'relate') {
            return;
        }
        definition.link = false;
        definition.metadata.link = false;
    }

    /**
     * Add onClick handler for link fields
     *
     * @param {object} store to use
     * @param {object} definition to update
     */
    protected addLinkSelectHandler(store: RecordListModalStore, definition: ColumnDefinition): void {
        if (!definition.link) {
            return;
        }

        definition.metadata.onClick = (field: Field, record: Record): void => {
            store.recordList.toggleSelection(record.id);
        };
    }
}
