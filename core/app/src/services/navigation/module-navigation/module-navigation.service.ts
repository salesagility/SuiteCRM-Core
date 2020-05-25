import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ModuleAction, NavbarModule, Navigation} from '@store/navigation/navigation.facade';
import {LanguageListStringMap, LanguageStrings} from '@store/language/language.facade';

export interface NavigationRoute {
    route: string;
    url: string;
    params: { [key: string]: string };
}

const ROUTE_PREFIX = './#';

@Injectable({providedIn: 'root'})
export class ModuleNavigation {

    constructor(protected router: Router) {
    }

    /**
     * Public Api
     */

    /**
     * Get module info
     *
     * @param {string} module name
     * @param {object} navigation info
     * @returns {object} module info
     */
    public getModuleInfo(module: string, navigation: Navigation): NavbarModule {
        if (!navigation || !navigation.modules) {
            return null;
        }

        return navigation.modules[module];
    }

    /**
     * Get module label
     *
     * @param {object} module info
     * @param {object} appListStrings map
     * @returns {string} the module label
     */
    public getModuleLabel(module: NavbarModule, appListStrings: LanguageListStringMap): string {
        if (!appListStrings || !appListStrings.moduleList || !module) {
            return '';
        }
        const labelKey = (module && module.labelKey) || '';

        return appListStrings.moduleList[labelKey] || labelKey;
    }

    /**
     * Get module route
     *
     * @param {object} module NavbarModule
     * @returns {object} NavigationRoute
     */
    public getModuleRoute(module: NavbarModule): NavigationRoute {
        let url = (module && module.defaultRoute) || '';
        let route = null;
        const params = null;

        if (url.startsWith(ROUTE_PREFIX)) {
            route = url.replace(ROUTE_PREFIX, '');
            url = null;
        }

        return {route, url, params};
    }

    /**
     * Navigate using action information
     *
     * @param {object} item ModuleAction
     * @returns {object} Promise<boolean>
     */
    public navigate(item: ModuleAction): Promise<boolean> {
        const route = this.getActionRoute(item);

        return this.router.navigate([route.route], {
            queryParams: route.params
        });
    }

    /**
     * Get action route info
     *
     * @param {object} action ModuleAction
     * @returns {object} NavigationRoute
     */
    public getActionRoute(action: ModuleAction): NavigationRoute {
        let url = action.url;
        let route = null;
        let params = null;

        if (url.startsWith(ROUTE_PREFIX)) {
            route = url.replace(ROUTE_PREFIX, '');
            url = null;

            if (action.params) {
                params = action.params;
            }
        }

        return {route, url, params};
    }

    /**
     * Get label for module action item
     *
     * @param {string} module name
     * @param {object} item action
     * @param {object} languages map
     * @returns {string} label
     */
    public getActionLabel(module: string, item: ModuleAction, languages: LanguageStrings): string {
        if (!languages || !languages.modStrings || !item || !module) {
            return '';
        }

        let label = languages.modStrings[module] && languages.modStrings[module][item.labelKey];

        if (!label) {
            label = languages.appStrings && languages.appStrings[item.labelKey];
        }

        return label || '';
    }
}
