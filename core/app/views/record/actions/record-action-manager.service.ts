import {Injectable} from '@angular/core';
import {RecordEditAction} from '@views/record/actions/edit/record-edit.action';
import {ViewMode} from '@app-common/views/view.model';
import {RecordActionData, RecordActionHandler, RecordActionHandlerMap} from '@views/record/actions/record.action';
import {RecordCreateAction} from '@views/record/actions/create/record-create.action';
import {RecordToggleWidgetsAction} from '@views/record/actions/toggle-widgets/record-widget-action.service';
import {RecordCancelAction} from '@views/record/actions/cancel/record-cancel.action';
import {RecordSaveAction} from '@views/record/actions/save/record-save.action';
import {RecordSaveNewAction} from '@views/record/actions/save-new/record-save-new.action';
import {CancelCreateAction} from '@views/record/actions/cancel-create/cancel-create.action';

@Injectable({
    providedIn: 'root',
})
export class RecordActionManager {

    actions: { [key: string]: RecordActionHandlerMap } = {
        edit: {} as RecordActionHandlerMap,
        detail: {} as RecordActionHandlerMap,
        create: {} as RecordActionHandlerMap
    };

    constructor(
        protected edit: RecordEditAction,
        protected create: RecordCreateAction,
        protected toggleWidgets: RecordToggleWidgetsAction,
        protected cancel: RecordCancelAction,
        protected cancelCreate: CancelCreateAction,
        protected save: RecordSaveAction,
        protected saveNew: RecordSaveNewAction,
    ) {
        edit.modes.forEach(mode => this.actions[mode][edit.key] = edit);
        create.modes.forEach(mode => this.actions[mode][create.key] = create);
        toggleWidgets.modes.forEach(mode => this.actions[mode][toggleWidgets.key] = toggleWidgets);
        cancel.modes.forEach(mode => this.actions[mode][cancel.key] = cancel);
        save.modes.forEach(mode => this.actions[mode][save.key] = save);
        saveNew.modes.forEach(mode => this.actions[mode][saveNew.key] = saveNew);
        cancelCreate.modes.forEach(mode => this.actions[mode][cancelCreate.key] = cancelCreate);
    }

    run(action: string, mode: ViewMode, data: RecordActionData): void {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action]) {
            return;
        }

        this.actions[mode][action].run(data);
    }

    getHandler(action: string, mode: ViewMode): RecordActionHandler {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action]) {
            return null;
        }

        return this.actions[mode][action];
    }
}
