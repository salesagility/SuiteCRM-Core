import {MenuItemLink} from '@app-common/menu/menu.model';

export interface LineAction {
    key: string;
    labelKey: string;
    label: string;
    module: string;
    legacyModuleName: string;
    icon: string;
    action: string;
    returnAction: string;
    params: { [key: string]: any };
    mapping: { [key: string]: any };
    link: MenuItemLink;
    acl: string[];
}
