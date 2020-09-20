import {Injectable} from '@angular/core';
import { ActionHandlerMap } from '@base/app-common/actions/action.model';
import {RecordActionData} from '@views/record/actions/record.action';
import {SubPanelCreateAction} from './actions/create/create.action';

@Injectable({
    providedIn: 'root',
})
export class SubPanelActionManager {

    actions: ActionHandlerMap = {
    };

    constructor(
        protected create: SubPanelCreateAction
    ) {
        this.actions[create.key] = create;
    }

    run(action: string, data: RecordActionData): void {
        this.actions[action].run(data);
    }
}
