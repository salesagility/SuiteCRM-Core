import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {TableConfig} from '@components/table/table.model';
import {FilterConfig} from '@components/list-filter/list-filter.model';

export interface RecordListModalTableAdapterInterface {

    /**
     * Get table config
     *
     * @param {object} store to use
     * @returns {object} TableConfig
     */
    getTable(store: RecordListModalStore): TableConfig;
}

export interface RecordListModalFilterAdapterInterface {

    /**
     * Get filter config
     *
     * @param {object} store to use
     * @returns {object} FilterConfig
     */
    getConfig(store: RecordListModalStore): FilterConfig;
}
