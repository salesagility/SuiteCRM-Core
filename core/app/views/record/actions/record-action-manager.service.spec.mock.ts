import {RecordEditAction} from '@views/record/actions/edit/record-edit.action';
import {RecordCreateAction} from '@views/record/actions/create/record-create.action';
import {RecordToggleWidgetsAction} from '@views/record/actions/toggle-widgets/record-widget-action.service';
import {RecordCancelAction} from '@views/record/actions/cancel/record-cancel.action';
import {NavigationExtras, Router} from '@angular/router';
import {RecordActionManager} from '@views/record/actions/record-action-manager.service';
import {moduleNameMapperMock} from '@services/navigation/module-name-mapper/module-name-mapper.service.spec.mock';
import {RecordSaveAction} from '@views/record/actions/save/record-save.action';
import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {CancelCreateAction} from '@views/record/actions/cancel-create/cancel-create.action';
import {actionNameMapperMock} from '@services/navigation/action-name-mapper/action-name-mapper.service.spec.mock';
import {RecordSaveNewAction} from '@views/record/actions/save-new/record-save-new.action';

const mockRouter = {
    navigate: (commands: any[], extras?: NavigationExtras) => {
        if (!extras || !commands) {
            return null;
        }

        return null;
    }
} as Router;

export class MockModal extends NgbModal {

    constructor() {
        super(null, null, null, null);
    }

    open(): NgbModalRef {
        return {
            componentInstance: {
                textKey: '',
                buttons: []
            }
        } as NgbModalRef;
    }
}


export const recordActionsManagerMock = new RecordActionManager(
    new RecordEditAction(),
    new RecordCreateAction(moduleNameMapperMock, mockRouter),
    new RecordToggleWidgetsAction(),
    new RecordCancelAction(new MockModal()),
    new CancelCreateAction(new MockModal(), mockRouter, moduleNameMapperMock, actionNameMapperMock),
    new RecordSaveAction(messageServiceMock),
    new RecordSaveNewAction(messageServiceMock, mockRouter, moduleNameMapperMock, actionNameMapperMock)
);
