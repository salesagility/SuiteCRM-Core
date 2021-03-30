import {ActionLinkModel} from './action-link-model';

export interface AllMenuModel {
    modules: Array<ActionLinkModel>;
    extra: Array<ActionLinkModel>;
}
