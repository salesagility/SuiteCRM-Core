import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';

@Injectable({
    providedIn: 'root'
})
export class RecordEditAction extends RecordActionHandler {

    key = 'edit';
    modes = ['detail' as ViewMode];

    constructor() {
        super();
    }

    run(data: RecordActionData): void {
        data.store.setMode('edit' as ViewMode);
    }
}
