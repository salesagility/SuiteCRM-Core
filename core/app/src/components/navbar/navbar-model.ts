import {ActionLinkModel} from './action-link-model';
import {CurrentUserModel} from './current-user-model';
import {AllMenuModel} from './all-menu-model';
import {LogoModel} from '../logo/logo-model';
import {GroupedTab, NavbarModuleMap} from '@base/facades/navigation/navigation.facade';
import {LanguageListStringMap, LanguageStringMap} from '@base/facades/language/language.facade';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {UserPreferenceMap} from '@base/facades/user-preference/user-preference.facade';

export interface NavbarModel {
    authenticated: boolean;
    logo: LogoModel;
    useGroupTabs: boolean;
    globalActions: ActionLinkModel[];
    currentUser: CurrentUserModel;
    all: AllMenuModel;
    menu: MenuItem[];

    resetMenu(): void;

    build(
        tabs: string[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap,
        menuItemThreshold: number,
        groupedTabs: GroupedTab[],
        userPreferences: UserPreferenceMap
    ): void;

    buildGroupTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap,
        menuItemThreshold: number,
        groupedTabs: GroupedTab[]
    ): void;

    buildTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap,
        menuItemThreshold: number): void;
}
