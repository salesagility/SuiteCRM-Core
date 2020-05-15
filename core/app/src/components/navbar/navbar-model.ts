import {ActionLinkModel} from './action-link-model';
import {CurrentUserModel} from './current-user-model';
import {AllMenuModel} from './all-menu-model';
import {LogoModel} from '../logo/logo-model';
import {GroupedTab, NavbarModuleMap, Navigation, UserActionMenu} from '@base/facades/navigation/navigation.facade';
import {LanguageStrings, LanguageStringMap} from '@base/facades/language/language.facade';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {UserPreferenceMap} from '@base/facades/user-preference/user-preference.facade';
import {AppState} from '@base/facades/app-state/app-state.facade';

export interface NavbarModel {
    authenticated: boolean;
    logo: LogoModel;
    useGroupTabs: boolean;
    globalActions: ActionLinkModel[];
    currentUser: CurrentUserModel;
    all: AllMenuModel;
    menu: MenuItem[];
    current?: MenuItem;

    resetMenu(): void;

    build(
        navigation: Navigation,
        languages: LanguageStrings,
        userPreferences: UserPreferenceMap,
        currentUser: CurrentUserModel,
        appState: AppState
    ): void;

    buildGroupTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        threshold: number,
        groupedTabs: GroupedTab[]
    ): void;

    buildUserActionMenu(
        appStrings: LanguageStringMap,
        userActionMenu: UserActionMenu[],
        currentUser: CurrentUserModel
    ): void;
}
