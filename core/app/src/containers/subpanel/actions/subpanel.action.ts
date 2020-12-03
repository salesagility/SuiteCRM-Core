import {ActionData, ActionHandler} from '@app-common/actions/action.model';

export interface SubpanelActionData extends ActionData {
    parentId: string;
    parentModule: string;
    module: string;
}

export interface SubpanelActionHandlerMap {
    [key: string]: SubpanelActionHandler;
}

export abstract class SubpanelActionHandler extends ActionHandler {

    abstract run(data: SubpanelActionData): void;
}
