/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {NavbarModel} from './navbar-model';
import {LogoAbstract} from '../logo/logo-abstract';
import {CurrentUserModel} from './current-user-model';
import {ActionLinkModel} from './action-link-model';
import {MenuItem, ready, User} from 'common';
import {LanguageStringMap, LanguageStrings} from '../../store/language/language.store';
import {
    GroupedTab,
    NavbarModule,
    NavbarModuleMap,
    Navigation,
    UserActionMenu
} from '../../store/navigation/navigation.store';
import {LinkTarget} from './link-target';
import {RouteConverter} from '../../services/navigation/route-converter/route-converter.service';
import {UserPreferenceMap} from '../../store/user-preference/user-preference.store';
import {ModuleNavigation} from '../../services/navigation/module-navigation/module-navigation.service';
import {AppState} from '../../store/app-state/app-state.store';

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
        this.currentUser = {} as User;
    }

    /**
     * Build user action menu
     *
     * @param {object} appStrings map
     * @param {[]} userActionMenu info
     * @param {object} currentUser info
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
     * @param {object} navigation info
     * @param {object} language map
     * @param {object} userPreferences info
     * @param {object} currentUser info
     * @param {object} appState info
     * @param {number} maxTabs to display
     */
    public build(
        navigation: Navigation,
        language: LanguageStrings,
        userPreferences: UserPreferenceMap,
        currentUser: CurrentUserModel,
        appState: AppState,
        maxTabs: number
    ): void {

        this.resetMenu();

        if (!ready([language.appStrings, language.modStrings, language.appListStrings, userPreferences, currentUser])) {
            return;
        }

        this.buildUserActionMenu(language.appStrings, navigation.userActionMenu, currentUser);

        const navigationParadigm = userPreferences.navigation_paradigm.toString();
        const sort = userPreferences.sort_modules_by_name.toString() === 'on';

        if (navigationParadigm === 'm') {
            this.buildModuleNavigation(navigation, language, appState, maxTabs, sort);
            return;
        }

        if (navigationParadigm === 'gm') {
            this.buildGroupedNavigation(navigation, language, appState, maxTabs, sort);
            return;
        }
    }

    /**
     * Build Group tab menu
     *
     * @param {[]} items list
     * @param {object} modules info
     * @param {object} languages map
     * @param {number} threshold limit
     * @param {object} groupedTabs info
     * @param {boolean} sort flag
     */
    public buildGroupTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        threshold: number,
        groupedTabs: GroupedTab[],
        sort: boolean
    ): void {

        const navItems = [];
        const moreItems = [];

        if (items && items.length > 0) {
            items.forEach((module) => {
                moreItems.push(this.buildTabMenuItem(module, modules[module], languages));
            });

            if (sort) {
                this.sortMenuItems(moreItems);
            }
        }

        let count = 0;
        groupedTabs.forEach((groupedTab: any) => {

            if (count <= threshold) {
                navItems.push(this.buildTabGroupedMenuItem(
                    groupedTab.labelKey,
                    groupedTab.modules,
                    modules,
                    languages,
                    sort
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
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     * @param {number} maxTabs to use
     * @param {boolean} sort flag
     */
    protected buildModuleNavigation(
        navigation: Navigation,
        languages: LanguageStrings,
        appState: AppState,
        maxTabs: number,
        sort: boolean
    ): void {

        if (!ready([navigation.tabs, navigation.modules])) {
            return;
        }

        this.buildTabMenu(navigation.tabs, navigation.modules, languages, maxTabs, appState, sort);
        this.buildSelectedModule(navigation, languages, appState);
    }

    /**
     * Build grouped navigation
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     * @param {number} maxTabs to use
     * @param {boolean} sort flag
     */
    protected buildGroupedNavigation(
        navigation: Navigation,
        languages: LanguageStrings,
        appState: AppState,
        maxTabs: number,
        sort: boolean
    ): void {

        if (!ready([navigation.tabs, navigation.modules, navigation.groupedTabs])) {
            return;
        }

        this.buildGroupTabMenu(navigation.tabs, navigation.modules, languages, maxTabs, navigation.groupedTabs, sort);
        this.buildSelectedModule(navigation, languages, appState);
    }

    /**
     * Build selected module
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
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
     * @param {object} modules info
     * @param {object} languages map
     * @param {number} threshold limit
     * @param {object} appState info
     * @param {boolean} sort flag
     */
    protected buildTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        threshold: number,
        appState: AppState,
        sort: boolean
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

            const item = this.buildTabMenuItem(module, modules[module], languages);

            if (module === 'home' || appState.module === module || count >= threshold) {
                moreItems.push(item);
            } else {
                navItems.push(item);
            }

            count++;
        });

        if (sort) {
            this.sortMenuItems(navItems);
            this.sortMenuItems(moreItems);
        }


        this.menu = navItems;
        this.all.modules = moreItems;
    }

    /**
     * Build Grouped Tab menu item
     *
     * @param {string} moduleLabel to display
     * @param {object} groupedModules list
     * @param {object} modules list
     * @param {object} languages map
     * @param {boolean} sort flag
     *
     * @returns {object} group tab menu item
     */
    protected buildTabGroupedMenuItem(
        moduleLabel: string,
        groupedModules: any[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        sort: boolean
    ): any {

        return {
            link: {
                label: (languages.appStrings && languages.appStrings[moduleLabel]) || moduleLabel,
                url: '',
                route: null,
                params: null
            },
            icon: '',
            submenu: this.buildGroupedMenu(groupedModules, modules, languages, sort)
        };
    }

    /**
     * Build Grouped menu
     *
     * @param {object} groupedModules info
     * @param {object} modules map
     * @param {object} languages maps
     * @param {boolean} sort flag
     *
     * @returns {[]} menu item array
     */
    protected buildGroupedMenu(
        groupedModules: any[],
        modules: NavbarModuleMap,
        languages: LanguageStrings,
        sort: boolean
    ): MenuItem[] {

        const groupedItems = [];
        let homeMenuItem = null;

        groupedModules.forEach((groupedModule) => {

            const module = modules[groupedModule];

            if (!module) {
                return;
            }

            const moduleMenuItem = this.buildTabMenuItem(groupedModule, module, languages);

            if (groupedModule === 'home') {
                homeMenuItem = moduleMenuItem;
                return;
            }

            groupedItems.push(moduleMenuItem);
        });

        if (sort) {
            this.sortMenuItems(groupedItems);
        }

        if (homeMenuItem) {
            groupedItems.unshift(homeMenuItem);
        }

        return groupedItems;
    }

    /**
     * Build module menu items
     *
     * @param {string} module name
     * @param {object} moduleInfo info
     * @param {object} languages object
     *
     * @returns {object} menuItem
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
            icon: (module === 'home') ? 'home' : '',
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

    /**
     * Sort menu items by label
     *
     * @param {object} navItems to sort
     */
    protected sortMenuItems(navItems: any[]): void {
        navItems.sort((a: MenuItem, b: MenuItem) => {

            const nameA = a.link.label.toUpperCase(); // ignore upper and lowercase
            const nameB = b.link.label.toUpperCase(); // ignore upper and lowercase

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
    }
}
