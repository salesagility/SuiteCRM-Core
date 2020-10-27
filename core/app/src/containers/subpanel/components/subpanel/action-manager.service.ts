import {Injectable} from '@angular/core';
import {SubpanelCreateAction} from '../../actions/create/create.action';
import {SubpanelActionData, SubpanelActionHandlerMap} from '@containers/subpanel/actions/subpanel.action';

@Injectable({
    providedIn: 'root',
})
export class SubpanelActionManager {

    actions: SubpanelActionHandlerMap = {};

    constructor(
        protected create: SubpanelCreateAction
    ) {
        this.actions[create.key] = create;
    }

    run(action: string, data: SubpanelActionData): void {
        this.actions[action].run(data);
    }
}
