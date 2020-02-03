import {LinkTarget} from './link-target';

export class LinkModel {
    label: string | undefined;
    url: string | undefined;
    target?: LinkTarget = LinkTarget.none;
}
