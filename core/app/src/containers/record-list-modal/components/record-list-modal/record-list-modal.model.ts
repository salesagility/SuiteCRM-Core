import {RecordSelection} from '@app-common/views/list/record-selection.model';
import {Record} from '@app-common/record/record.model';

export interface RecordListModalResult {
    [key: string]: any;

    selection: RecordSelection;
    records: Record[];
}
