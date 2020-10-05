import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';

export interface RecordSelection {
    all: boolean;
    status: SelectionStatus;
    selected: { [key: string]: string };
    count: number;
}
