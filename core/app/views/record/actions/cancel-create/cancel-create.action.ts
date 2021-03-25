import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ViewMode} from '@app-common/views/view.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageModalComponent} from '@components/modal/components/message-modal/message-modal.component';
import {ModalButtonInterface} from '@app-common/components/modal/modal.model';
import {Router} from '@angular/router';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';

@Injectable({
    providedIn: 'root'
})
export class CancelCreateAction extends RecordActionHandler {

    key = 'cancelCreate';
    modes = ['create' as ViewMode];

    constructor(
        private modalService: NgbModal,
        protected router: Router,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper
    ) {
        super();
    }

    run(data: RecordActionData): void {

        if (data.store.recordStore.isDirty()) {
            this.showConfirmationModal(data);
            return;
        }

        this.cancel(data);
    }

    shouldDisplay(): boolean {
        return true;
    }

    protected cancel(data: RecordActionData): void {
        const store = data.store;

        let returnModule = store.getModuleName();

        if (store.params.return_module) {
            returnModule = this.moduleNameMapper.toFrontend(store.params.return_module);
        }

        let returnAction = store.params.return_action || '';
        const returnId = store.params.return_id || '';

        let route = '/' + returnModule;

        if (returnAction) {
            returnAction = this.actionNameMapper.toFrontend(returnAction);

            if (returnAction !== 'record' || returnId) {
                route += '/' + returnAction;
            }
        }

        if (returnId) {
            route += '/' + returnId;
        }

        this.router.navigate([route]).then();
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
