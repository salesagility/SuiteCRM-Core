import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';

@Injectable({
    providedIn: 'root'
})
export class RecordHistoryAction extends RecordActionHandler {

    key = 'history';
    modes = ['detail' as ViewMode, 'edit' as ViewMode];

    constructor() {
        super();
    }

    run(data: RecordActionData): void {
        data.store.showWidgets = !data.store.showWidgets;
    }
}
