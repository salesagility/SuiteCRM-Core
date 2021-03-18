import {ActionData, ActionHandler} from '@app-common/actions/action.model';
import {SubpanelStore} from '@containers/subpanel/store/subpanel/subpanel.store';

export interface SubpanelActionData extends ActionData {
    parentId: string;
    parentModule: string;
    store: SubpanelStore;
    module: string;
}

export interface SubpanelActionHandlerMap {
    [key: string]: SubpanelActionHandler;
}

export abstract class SubpanelActionHandler extends ActionHandler {

    abstract run(data: SubpanelActionData): void;
}
