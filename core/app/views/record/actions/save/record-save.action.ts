import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';
import {take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RecordSaveAction extends RecordActionHandler {

    key = 'save';
    modes = ['edit' as ViewMode];

    constructor() {
        super();
    }

    run(data: RecordActionData): void {
        data.store.recordManager.validate().pipe(take(1)).subscribe(
            valid => {
                if (valid) {
                    data.store.save().pipe(take(1)).subscribe();
                }
            }
        );
    }

    shouldDisplay(): boolean {
        return true;
    }
}
