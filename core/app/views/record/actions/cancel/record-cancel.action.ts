import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';

@Injectable({
    providedIn: 'root'
})
export class RecordCancelAction extends RecordActionHandler {

    key = 'cancel';
    modes = ['edit' as ViewMode];

    constructor() {
        super();
    }

    run(data: RecordActionData): void {
        data.store.recordManager.resetStaging();
        data.store.setMode('detail' as ViewMode);
    }
}
