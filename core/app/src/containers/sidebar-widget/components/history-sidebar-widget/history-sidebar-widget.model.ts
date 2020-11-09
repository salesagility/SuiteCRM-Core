import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';

export interface HistoryTimelineEntry {
    title: Field;
    module: string;
    icon: string;
    color: string;
    user: Field;
    date: Field;
    record: Record;
}
