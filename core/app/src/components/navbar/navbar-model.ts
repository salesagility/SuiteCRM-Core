import {ActionLinkModel} from './action-link-model';
import {CurrentUserModel} from './current-user-model';
import {AllMenuModel} from './all-menu-model';
import {LogoModel} from '../logo/logo-model';
import {GroupedTab, NavbarModuleMap, Navigation, UserActionMenu} from '@store/navigation/navigation.store';
import {LanguageStrings, LanguageStringMap} from '@store/language/language.store';
import {UserPreferenceMap} from '@store/user-preference/user-preference.store';
import {AppState} from '@store/app-state/app-state.store';
import {MenuItem} from '@app-common/menu/menu.model';

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
        appState: AppState,
        itemThreshold: number
    ): void;

    buildGroupTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        threshold: number,
        groupedTabs: GroupedTab[],
        sort: boolean
    ): void;

    buildUserActionMenu(
        appStrings: LanguageStringMap,
        userActionMenu: UserActionMenu[],
        currentUser: CurrentUserModel
    ): void;
}
