import {Injectable} from '@angular/core';
import {RecordEditAction} from '@views/record/actions/edit/record-edit.action';
import {ActionHandlerMap} from '@app-common/actions/action.model';
import {ViewMode} from '@app-common/views/view.model';
import {RecordActionData} from '@views/record/actions/record.action';
import {RecordCreateAction} from '@views/record/actions/create/record-create.action';
import {RecordHistoryAction} from '@views/record/actions/history/record-history.action';
import {RecordCancelAction} from '@views/record/actions/cancel/record-cancel.action';
import {RecordSaveAction} from '@views/record/actions/save/record-save.action';

@Injectable({
    providedIn: 'root',
})
export class RecordActionManager {

    actions: { [key: string]: ActionHandlerMap } = {
        edit: {} as ActionHandlerMap,
        detail: {} as ActionHandlerMap
    };

    constructor(
        protected edit: RecordEditAction,
        protected create: RecordCreateAction,
        protected history: RecordHistoryAction,
        protected cancel: RecordCancelAction,
        protected save: RecordSaveAction
    ) {
        edit.modes.forEach(mode => this.actions[mode][edit.key] = edit);
        create.modes.forEach(mode => this.actions[mode][create.key] = create);
        history.modes.forEach(mode => this.actions[mode][history.key] = history);
        cancel.modes.forEach(mode => this.actions[mode][cancel.key] = cancel);
        save.modes.forEach(mode => this.actions[mode][save.key] = save);
    }

    run(action: string, mode: ViewMode, data: RecordActionData): void {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action]) {
            return;
        }

        this.actions[mode][action].run(data);
    }
}
