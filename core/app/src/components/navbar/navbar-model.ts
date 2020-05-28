import {ActionLinkModel} from './action-link-model';
import {CurrentUserModel} from './current-user-model';
import {AllMenuModel} from './all-menu-model';
import {LogoModel} from '../logo/logo-model';
import {GroupedTab, NavbarModuleMap, Navigation, UserActionMenu} from '@base/store/navigation/navigation.facade';
import {LanguageStrings, LanguageStringMap} from '@base/store/language/language.facade';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {UserPreferenceMap} from '@base/store/user-preference/user-preference.facade';
import {AppState} from '@base/store/app-state/app-state.facade';

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
