import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';
import {take} from 'rxjs/operators';
import {MessageService} from '@services/message/message.service';

@Injectable({
    providedIn: 'root'
})
export class RecordSaveAction extends RecordActionHandler {

    key = 'save';
    modes = ['edit' as ViewMode];

    constructor(protected message: MessageService) {
        super();
    }

    run(data: RecordActionData): void {
        data.store.recordStore.validate().pipe(take(1)).subscribe(valid => {
            if (valid) {
                data.store.save().pipe(take(1)).subscribe();
                return;
            }

            this.message.addWarningMessageByKey('LBL_VALIDATION_ERRORS');
        });
    }

    shouldDisplay(): boolean {
        return true;
    }
}
