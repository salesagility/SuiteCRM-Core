import {ActionLinkModel} from './action-link-model';
import {CurrentUserModel} from './current-user-model';
import {AllMenuModel} from './all-menu-model';
import {LogoModel} from '../logo/logo-model';
import {NavbarModuleMap} from '@base/facades/navigation/navigation.facade';
import {LanguageListStringMap, LanguageStringMap} from '@base/facades/language/language.facade';
import {MenuItem} from '@components/navbar/navbar.abstract';

export interface NavbarModel {
    authenticated: boolean;
    logo: LogoModel;
    useGroupTabs: boolean;
    globalActions: ActionLinkModel[];
    currentUser: CurrentUserModel;
    all: AllMenuModel;
    menu: MenuItem[];

    resetMenu(): void;

    buildMenu(
        items: string[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap,
        menuItemThreshold: number): void;
}
