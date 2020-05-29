import {NavbarModel} from './navbar-model';
import {LogoAbstract} from '../logo/logo-abstract';
import {
    GroupedTab,
    NavbarModule,
    NavbarModuleMap,
    Navigation,
    UserActionMenu
} from '@store/navigation/navigation.store';
import {LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {CurrentUserModel} from './current-user-model';
import {ActionLinkModel} from './action-link-model';
import {ready} from '@base/utils/object-utils';
import {UserPreferenceMap} from '@store/user-preference/user-preference.store';
import {AppState} from '@store/app-state/app-state.store';
import {LinkTarget} from '@components/navbar/link-target';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

export interface RecentRecordsMenuItem {
    summary: string;
    url: string;
}

export interface MenuItemLink {
    label: string;
    url: string;
    route?: string;
    params?: { [key: string]: string };
}

export interface MenuItem {
    link: MenuItemLink;
    icon: string;
    submenu: MenuItem[];
    recentRecords?: RecentRecordsMenuItem[];
}

export class NavbarAbstract implements NavbarModel {
    authenticated = true;
    logo = new LogoAbstract();
    useGroupTabs = false;
    globalActions: ActionLinkModel[] = [];
    currentUser: CurrentUserModel = {
        id: '',
        firstName: '',
        lastName: '',
    };
    all = {
        modules: [],
        extra: [],
    };
    menu: MenuItem[] = [];
    current?: MenuItem;

    /**
     * Public API
     */

    constructor(
        private routeConverter: RouteConverter,
        protected moduleNavigation: ModuleNavigation
    ) {
    }

    /**
     * Reset menus
     */
    public resetMenu(): void {
        this.menu = [];
        this.globalActions = [];
        this.all.modules = [];
        this.all.extra = [];
        this.current = null;
    }

    /**
     * Build user action menu
     *
     * @param {{}} appStrings map
     * @param {[]} userActionMenu info
     * @param {{}} currentUser info
     */
    public buildUserActionMenu(
        appStrings: LanguageStringMap,
        userActionMenu: UserActionMenu[],
        currentUser: CurrentUserModel
    ): void {
        this.currentUser.id = currentUser.id;
        this.currentUser.firstName = currentUser.firstName;
        this.currentUser.lastName = currentUser.lastName;

        if (userActionMenu) {
            userActionMenu.forEach((subMenu) => {
                const name = subMenu.name;
                let url = subMenu.url;

                if (name === 'logout') {
                    return;
                }

                let target = LinkTarget.none;

                if (name === 'training') {
                    target = LinkTarget.blank;
                } else {
                    url = this.routeConverter.toFrontEndLink(url);
                }

                const label = appStrings[subMenu.labelKey];

                this.globalActions.push({
                    link: {
                        url,
                        label,
                        target
                    },
                });
            });
        }
        return;
    }

    /**
     * Build navbar
     *
     * @param {{}} navigation info
     * @param {{}} language map
     * @param {{}} userPreferences info
     * @param {{}} currentUser info
     * @param {{}} appState info
     */
    public build(
        navigation: Navigation,
        language: LanguageStrings,
        userPreferences: UserPreferenceMap,
        currentUser: CurrentUserModel,
        appState: AppState
    ): void {

        this.resetMenu();

        if (!ready([language.appStrings, language.modStrings, language.appListStrings, userPreferences, currentUser])) {
            return;
        }

        this.buildUserActionMenu(language.appStrings, navigation.userActionMenu, currentUser);

        const navigationParadigm = userPreferences.navigation_paradigm.toString();

        if (navigationParadigm === 'm') {
            this.buildModuleNavigation(navigation, language, appState);
            return;
        }

        if (navigationParadigm === 'gm') {
            this.buildGroupedNavigation(navigation, language, appState);
            return;
        }
    }

    /**
     * Build Group tab menu
     *
     * @param {[]} items list
     * @param {{}} modules info
     * @param {{}} languages map
     * @param {number} threshold limit
     * @param {{}} groupedTabs info
     */
    public buildGroupTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        threshold: number,
        groupedTabs: GroupedTab[]
    ): void {

        const navItems = [];
        const moreItems = [];

        if (items && items.length > 0) {
            items.forEach((module) => {
                moreItems.push(this.buildTabMenuItem(module, modules[module], languages));
            });
        }

        let count = 0;
        groupedTabs.forEach((groupedTab: any) => {

            if (count <= threshold) {
                navItems.push(this.buildTabGroupedMenuItem(
                    groupedTab.labelKey,
                    groupedTab.modules,
                    modules,
                    languages
                ));
            }

            count++;
        });

        this.menu = navItems;
        this.all.modules = moreItems;
    }

    /**
     *
     * Internal API
     *
     */

    /**
     * Build module navigation
     *
     * @param {{}} navigation info
     * @param {{}} languages map
     * @param {{}} appState info
     */
    protected buildModuleNavigation(
        navigation: Navigation,
        languages: LanguageStrings,
        appState: AppState
    ): void {

        if (!ready([navigation.tabs, navigation.modules])) {
            return;
        }

        this.buildTabMenu(navigation.tabs, navigation.modules, languages, navigation.maxTabs, appState);
        this.buildSelectedModule(navigation, languages, appState);
    }

    /**
     * Build grouped navigation
     *
     * @param {{}} navigation info
     * @param {{}} languages map
     * @param {{}} appState info
     */
    protected buildGroupedNavigation(
        navigation: Navigation,
        languages: LanguageStrings,
        appState: AppState
    ): void {

        if (!ready([navigation.tabs, navigation.modules, navigation.groupedTabs])) {
            return;
        }

        this.buildGroupTabMenu(navigation.tabs, navigation.modules, languages, navigation.maxTabs, navigation.groupedTabs);
        this.buildSelectedModule(navigation, languages, appState);
    }

    /**
     * Build selected module
     *
     * @param {{}} navigation info
     * @param {{}} languages map
     * @param {{}} appState info
     */
    protected buildSelectedModule(navigation: Navigation, languages: LanguageStrings, appState: AppState): void {
        if (!appState || !appState.module || appState.module === 'home') {
            return;
        }

        const module = appState.module;

        if (!navigation.modules[module]) {
            return;
        }

        this.current = this.buildTabMenuItem(module, navigation.modules[module], languages);
    }

    /**
     * Build tab / module menu
     *
     * @param {[]} items list
     * @param {{}} modules info
     * @param {{}} languages map
     * @param {number} threshold limit
     * @param {{}} appState info
     */
    protected buildTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        threshold: number,
        appState: AppState
    ): void {

        const navItems = [];
        const moreItems = [];

        if (!items || items.length === 0) {
            this.menu = navItems;
            this.all.modules = moreItems;
            return;
        }

        let count = 0;
        items.forEach((module: string) => {

            if (module === 'home') {
                return;
            }

            const item = this.buildTabMenuItem(module, modules[module], languages);

            if (appState.module === module || count >= threshold) {
                moreItems.push(item);
            } else {
                navItems.push(item);
            }

            count++;
        });

        this.menu = navItems;
        this.all.modules = moreItems;
    }


    /**
     * Build Grouped Tab menu item
     *
     * @param {string} moduleLabel to display
     * @param {{}} groupedModules list
     * @param {{}} modules list
     * @param {{}} languages map
     *
     * @returns {{}} group tab menu item
     */
    protected buildTabGroupedMenuItem(
        moduleLabel: string,
        groupedModules: any[],
        modules: NavbarModuleMap,
        languages: LanguageStrings
    ): any {

        return {
            link: {
                label: (languages.appStrings && languages.appStrings[moduleLabel]) || moduleLabel,
                url: '',
                route: null,
                params: null
            },
            icon: '',
            submenu: this.buildGroupedMenu(groupedModules, modules, languages)
        };
    }

    /**
     * Build Grouped menu
     *
     * @param {{}} groupedModules info
     * @param {{}} modules map
     * @param {{}} languages maps
     *
     * @returns {[]} menu item array
     */
    protected buildGroupedMenu(
        groupedModules: any[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
    ): MenuItem[] {

        const groupedItems = [];

        groupedModules.forEach((groupedModule) => {

            const module = modules[groupedModule];

            if (!module) {
                return;
            }

            groupedItems.push(this.buildTabMenuItem(groupedModule, module, languages));
        });

        return groupedItems;
    }

    /**
     * Build module menu items
     *
     * @param {string} module name
     * @param {{}} moduleInfo info
     * @param {{}} languages object
     *
     * @returns {{}} menuItem
     */
    protected buildTabMenuItem(
        module: string,
        moduleInfo: NavbarModule,
        languages: LanguageStrings,
    ): MenuItem {

        const moduleRoute = this.moduleNavigation.getModuleRoute(moduleInfo);

        const menuItem = {
            link: {
                label: this.moduleNavigation.getModuleLabel(moduleInfo, languages.appListStrings),
                url: moduleRoute.url,
                route: moduleRoute.route,
                params: null
            },
            icon: '',
            submenu: []
        };

        if (moduleInfo) {
            moduleInfo.menu.forEach((subMenu) => {

                const moduleActionRoute = this.moduleNavigation.getActionRoute(subMenu);

                menuItem.submenu.push({
                    link: {
                        label: this.moduleNavigation.getActionLabel(module, subMenu, languages),
                        url: moduleActionRoute.url,
                        route: moduleActionRoute.route,
                        params: moduleActionRoute.params
                    },
                    icon: subMenu.icon,
                    submenu: []
                });
            });
        }

        return menuItem;
    }
}
