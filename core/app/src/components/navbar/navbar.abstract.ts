import {NavbarModel} from './navbar-model';
import {LogoAbstract} from '../logo/logo-abstract';
import {GroupedTab, NavbarModuleMap, UserActionMenu} from '@base/facades/navigation/navigation.facade';
import {LanguageListStringMap, LanguageStringMap} from '@base/facades/language/language.facade';

import {CurrentUserModel} from './current-user-model';
import {ActionLinkModel} from './action-link-model';
import {ready} from '@base/utils/object-utils';
import {UserPreferenceMap} from '@base/facades/user-preference/user-preference.facade';

export interface RecentRecordsMenuItem {
    summary: string;
    url: string;
}

export interface MenuItem {
    link: {
        label: string;
        url: string;
        route?: string;
        params?: { [key: string]: string };
    };
    icon: string;
    submenu: MenuItem[];
    recentRecords?: RecentRecordsMenuItem[];
}

const ROUTE_PREFIX = './#';

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

    /**
     * Reset menus
     */
    public resetMenu(): void {
        this.menu = [];
        this.globalActions = [];
        this.all.modules = [];
        this.all.extra = [];
    }

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
                let name = subMenu.name;
                let url = subMenu.url;
                let urlParams;

                if (name == 'logout') {
                    return;
                }

                if (name !== 'training') {
                    urlParams = this.getModuleFromUrlParams(url);
                    url = ROUTE_PREFIX + '/' + (urlParams.module).toLowerCase() + '/' + (urlParams.action).toLowerCase();
                }

                let label = appStrings[subMenu.labelKey];

                this.globalActions.push({
                    link: {
                        url: url,
                        label: label,
                    },
                });
            });
        }
        return;
    }

    /**
     * Build navbar
     * @param tabs
     * @param modules
     * @param appStrings
     * @param modStrings
     * @param appListStrings
     * @param menuItemThreshold
     * @param groupedTabs
     * @param userPreferences
     * @param userActionMenu
     * @param currentUser
     */
    public build(
        tabs: string[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap,
        menuItemThreshold: number,
        groupedTabs: GroupedTab[],
        userPreferences: UserPreferenceMap,
        userActionMenu: UserActionMenu[],
        currentUser: CurrentUserModel,
    ): void {

        this.resetMenu();

        if (!ready([tabs, modules, appStrings, modStrings, appListStrings, userPreferences])) {
            return;
        }

        this.buildUserActionMenu(appStrings, userActionMenu, currentUser);

        const navigationParadigm = userPreferences.navigation_paradigm;

        if (navigationParadigm.toString() === 'm') {
            this.buildTabMenu(tabs, modules, appStrings, modStrings, appListStrings, menuItemThreshold);
            return;
        }

        if (navigationParadigm.toString() === 'gm') {
            this.buildGroupTabMenu(tabs, modules, appStrings, modStrings, appListStrings, menuItemThreshold, groupedTabs);
            return;
        }
    }

    /**
     * Build Group tab menu
     * @param items
     * @param modules
     * @param appStrings
     * @param modStrings
     * @param appListStrings
     * @param threshold
     * @param groupedTabs
     */
    public buildGroupTabMenu(
        items: string[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap,
        threshold: number,
        groupedTabs: GroupedTab[]): void {

        const navItems = [];
        const moreItems = [];

        if (items && items.length > 0) {
            items.forEach((module) => {
                moreItems.push(this.buildTabMenuItem(module, modules[module], appStrings, modStrings, appListStrings));
            });
        }

        let count = 0;
        groupedTabs.forEach((groupedTab: any) => {

            if (count <= threshold) {
                navItems.push(this.buildTabGroupedMenuItem(
                    groupedTab.labelKey,
                    groupedTab.modules,
                    modules,
                    appStrings,
                    modStrings,
                    appListStrings
                ));
            }

            count++;
        });

        this.menu = navItems;
        this.all.modules = moreItems;
    }

    /**
     * Build tab / module menu
     * @param items
     * @param modules
     * @param appStrings
     * @param modStrings
     * @param appListStrings
     * @param threshold
     */
    public buildTabMenu(items: string[],
                        modules: NavbarModuleMap,
                        appStrings: LanguageStringMap,
                        modStrings: LanguageListStringMap,
                        appListStrings: LanguageListStringMap,
                        threshold: number
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

            if (count <= threshold) {
                navItems.push(this.buildTabMenuItem(module, modules[module], appStrings, modStrings, appListStrings));
            } else {
                moreItems.push(this.buildTabMenuItem(module, modules[module], appStrings, modStrings, appListStrings));
            }

            count++;
        });

        this.menu = navItems;
        this.all.modules = moreItems;
    }

    /**
     * Build Grouped Tab menu item
     * @param moduleLabel to display
     * @param groupedModules list
     * @param modules list
     * @param appStrings list
     * @param modStrings list
     * @param appListStrings list
     */
    public buildTabGroupedMenuItem(
        moduleLabel: string,
        groupedModules: any[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap
    ): any {
        let moduleUrl = '';

        let moduleRoute = null;

        if (moduleUrl.startsWith(ROUTE_PREFIX)) {
            moduleRoute = moduleUrl.replace(ROUTE_PREFIX, '');
            moduleUrl = null;
        }

        return {
            link: {
                label: (appStrings && appStrings[moduleLabel]) || moduleLabel,
                url: moduleUrl,
                route: moduleRoute,
                params: null
            },
            icon: '',
            submenu: this.buildGroupedMenu(groupedModules, modules, appStrings, modStrings, appListStrings)
        };
    }

    /**
     * Build Grouped menu
     * @param groupedModules
     * @param modules
     * @param appStrings
     * @param modStrings
     * @param appListStrings
     */
    public buildGroupedMenu(
        groupedModules: any[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap
    ): MenuItem[] {

        const groupedItems = [];

        groupedModules.forEach((groupedModule) => {

            const module = modules[groupedModule];

            if (!module) {
                return;
            }

            groupedItems.push(this.buildTabMenuItem(groupedModule, module, appStrings, modStrings, appListStrings));
        });

        return groupedItems;
    }

    /**
     * Build module menu items
     * @param module
     * @param moduleInfo
     * @param appStrings
     * @param modStrings
     * @param appListStrings
     */
    public buildTabMenuItem(
        module: string,
        moduleInfo: any,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap
    ): MenuItem {

        let moduleUrl = (moduleInfo && moduleInfo.defaultRoute) || moduleInfo.defaultRoute;
        let moduleRoute = null;
        if (moduleUrl.startsWith(ROUTE_PREFIX)) {
            moduleRoute = moduleUrl.replace(ROUTE_PREFIX, '');
            moduleUrl = null;
        }

        const moduleLabel = (moduleInfo && moduleInfo.labelKey) || moduleInfo.labelKey;
        const menuItem = {
            link: {
                label: (appListStrings && appListStrings.moduleList[moduleInfo.labelKey]) || moduleLabel,
                url: moduleUrl,
                route: moduleRoute,
                params: null
            },
            icon: '',
            submenu: []
        };

        if (moduleInfo) {
            moduleInfo.menu.forEach((subMenu) => {
                let label = modStrings[module][subMenu.labelKey];

                if (!label) {
                    label = appStrings[subMenu.labelKey];
                }

                let actionUrl = subMenu.url;
                let actionRoute = null;
                let actionParams = null;
                if (actionUrl.startsWith(ROUTE_PREFIX)) {
                    actionRoute = actionUrl.replace(ROUTE_PREFIX, '');
                    actionUrl = null;

                    if (subMenu.params) {
                        actionParams = subMenu.params;
                    }
                }


                menuItem.submenu.push({
                    link: {
                        label,
                        url: actionUrl,
                        route: actionRoute,
                        params: actionParams
                    },
                    icon: subMenu.icon,
                    submenu: []
                });
            });
        }

        return menuItem;
    }

    /**
     * @param search
     */
    private getModuleFromUrlParams(search) {
        const hashes = search.slice(search.indexOf('?') + 1).split('&')
        const params = {}
        hashes.map(hash => {
            const [key, val] = hash.split('=')
            params[key] = decodeURIComponent(val)
        })
        return params
    }
}
