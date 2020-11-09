import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';

@Injectable({
    providedIn: 'root'
})
export class RecordToggleWidgetsAction extends RecordActionHandler {

    key = 'toggle-widgets';
    modes = ['detail' as ViewMode, 'edit' as ViewMode];

    constructor() {
        super();
    }

    run(data: RecordActionData): void {
        data.store.showSidebarWidgets = !data.store.showSidebarWidgets;
    }

    shouldDisplay(store: RecordViewStore): boolean {
        return store.widgets;
    }
}
