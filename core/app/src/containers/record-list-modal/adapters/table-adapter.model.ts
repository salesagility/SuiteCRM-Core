import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {TableConfig} from '@components/table/table.model';

export interface RecordListModalTableAdapterInterface {

    /**
     * Get table config
     *
     * @param {object} store to use
     * @returns {object} TableConfig
     */
    getTable(store: RecordListModalStore): TableConfig;
}
