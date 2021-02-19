import {Observable} from 'rxjs';
import {SelectionStatus} from './record-selection.model';

export interface SelectionDataSource {
    getSelectionStatus(): Observable<SelectionStatus>;

    getSelectedCount(): Observable<number>;

    updateSelection(state: SelectionStatus): void;
}
