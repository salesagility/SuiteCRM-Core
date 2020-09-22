import {ActionData, ActionHandler} from '@app-common/actions/action.model';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {ViewMode} from '@app-common/views/view.model';

export interface RecordActionData extends ActionData {
    store: RecordViewStore;
}

export abstract class RecordActionHandler extends ActionHandler {

    abstract modes: ViewMode[];

    abstract run(data: RecordActionData): void;
}
