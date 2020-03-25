import {NavbarModel} from './navbar-model';
import {LogoAbstract} from '../logo/logo-abstract';
import {NavbarModule, NavbarModuleMap, GroupedTab} from "@base/facades/navigation/navigation.facade";
import {LanguageListStringMap, LanguageStringMap} from '@base/facades/language/language.facade';

import {CurrentUserModel} from './current-user-model';
import {ActionLinkModel} from './action-link-model';

export interface RecentRecordsMenuItem {
    summary: string;
    url: string;
}

export interface MenuItem {
    link: {
        label: string;
        url: string;
        route?: string;
        params?: { [key: string]: string; }
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
    globalActions: ActionLinkModel[] = [
        {
            link: {
                url: '',
                label: 'Employees'
            }
        },
        {
            link: {
                url: '',
                label: 'Admin'
            }
        },
        {
            link: {
                url: '',
                label: 'Support Forums'
            }
        },
        {
            link: {
                url: '',
                label: 'About'
            }
        }
    ];
    currentUser: CurrentUserModel = {
        id: '1',
        name: 'Will Rennie',
    };
    all = {
        modules: [],
        extra: [],
    };
    menu: MenuItem[] = [];

    public resetMenu() {
        this.menu = [];
        this.all.modules = [];
    }

    public buildGroupTabMenu(items: string[], modules: NavbarModuleMap, appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap, appListStrings: LanguageListStringMap, threshold: number, groupedTabs: GroupedTab[]): void
    {
        const navItems = [];
        const moreItems = [];

        if (!items || items.length === 0) {
            this.menu = navItems;
            this.all.extra = moreItems;
            return;
        }

        let count = 0;
        groupedTabs.forEach((groupedTab: any) => {
            
            if (count <= threshold) {
                navItems.push(this.buildTabGroupedMenuItem(groupedTab.labelKey, groupedTab.modules, modules, appStrings, modStrings, appListStrings));
            }

            count++;
        });

        this.menu = navItems;
        this.all.modules = moreItems;
        this.all.extra = moreItems;
    }

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
            this.all.extra = moreItems;
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
        this.all.extra = moreItems;
    }

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

        const menuItem = {
            link: {
                label: (appStrings && appStrings[moduleLabel]) || moduleLabel,
                url: moduleUrl,
                route: moduleRoute,
                params: null
            },
            icon: '',
            submenu: this.buildGroupedMenu(groupedModules, modules, appStrings, modStrings, appListStrings)
        };

        return menuItem;
    }

    public buildGroupedMenu(
        groupedModules: any[],
        modules: NavbarModuleMap,
        appStrings: LanguageStringMap,
        modStrings: LanguageListStringMap,
        appListStrings: LanguageListStringMap
    ): MenuItem[] {

        const groupedItems = [];

        groupedModules.forEach((groupedModule) => {

            let module = modules[groupedModule];

            if (module === undefined) {
                return;
            }

            groupedItems.push(this.buildTabMenuItem(groupedModule, module, appStrings, modStrings, appListStrings));
        });
        
        return groupedItems;
    }

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
}
