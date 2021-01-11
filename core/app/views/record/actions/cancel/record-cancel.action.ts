import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageModalComponent} from '@components/modal/components/message-modal/message-modal.component';
import {ModalButtonInterface} from '@app-common/components/modal/modal.model';

@Injectable({
    providedIn: 'root'
})
export class RecordCancelAction extends RecordActionHandler {

    key = 'cancel';
    modes = ['edit' as ViewMode];

    constructor(private modalService: NgbModal) {
        super();
    }

    run(data: RecordActionData): void {

        if (data.store.recordManager.isDirty()) {
            this.showConfirmationModal(data);
            return;
        }

        this.cancel(data);
    }

    shouldDisplay(): boolean {
        return true;
    }

    protected cancel(data: RecordActionData): void {
        data.store.recordManager.resetStaging();
        data.store.setMode('detail' as ViewMode);
    }

    protected showConfirmationModal(data: RecordActionData): void {
        const modal = this.modalService.open(MessageModalComponent);

        modal.componentInstance.textKey = 'WARN_UNSAVED_CHANGES';
        modal.componentInstance.buttons = [
            {
                labelKey: 'LBL_CANCEL',
                klass: ['btn-secondary'],
                onClick: activeModal => activeModal.dismiss()
            } as ModalButtonInterface,
            {
                labelKey: 'LBL_OK',
                klass: ['btn-main'],
                onClick: activeModal => {
                    this.cancel(data);
                    activeModal.close();
                }
            } as ModalButtonInterface,
        ];
    }
}
