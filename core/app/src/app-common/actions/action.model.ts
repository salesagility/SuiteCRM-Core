import {Observable} from 'rxjs';

export interface ActionData {
    [key: string]: any;
}

export interface ActionHandlerMap {
    [key: string]: ActionHandler;
}

export abstract class ActionHandler {
    abstract key: string;

    abstract run(data: ActionData): void;
}

export interface ModeActions {
    [key: string]: Action[];
}

export interface Action {
    key: string;
    labelKey: string;
    label?: string;
    icon?: string;
    params: { [key: string]: any };
    acl: string[];
}

export interface ActionDataSource {
    getActions(): Observable<Action[]>;

    runAction(action: string): void;
}
