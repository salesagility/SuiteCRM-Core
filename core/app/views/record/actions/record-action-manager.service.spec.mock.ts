import {RecordEditAction} from '@views/record/actions/edit/record-edit.action';
import {RecordCreateAction} from '@views/record/actions/create/record-create.action';
import {RecordToggleWidgetsAction} from '@views/record/actions/toggle-widgets/record-widget-action.service';
import {RecordCancelAction} from '@views/record/actions/cancel/record-cancel.action';
import {NavigationExtras, Router} from '@angular/router';
import {RecordActionManager} from '@views/record/actions/record-action-manager.service';
import {moduleNameMapperMock} from '@services/navigation/module-name-mapper/module-name-mapper.service.spec.mock';
import {RecordSaveAction} from '@views/record/actions/save/record-save.action';

const mockRouter = {
    navigate: (
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        commands: any[],
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        extras?: NavigationExtras
    ) => null
} as Router;

export const recordActionsManagerMock = new RecordActionManager(
    new RecordEditAction(),
    new RecordCreateAction(moduleNameMapperMock, mockRouter),
    new RecordToggleWidgetsAction(),
    new RecordCancelAction(),
    new RecordSaveAction()
);
