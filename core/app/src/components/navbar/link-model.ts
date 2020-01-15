import {IconRefModel} from '../svg-icon/icon-ref-model';
import {LinkTarget} from './link-target';

export class LinkModel {
    iconRef?: IconRefModel;
    label: string | undefined;
    url: string | undefined;
    target?: LinkTarget = LinkTarget.none;
}
