import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ModuleAction, NavbarModule, Navigation} from '@store/navigation/navigation.store';
import {LanguageListStringMap, LanguageStrings} from '@store/language/language.store';

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
     * @param {string} labelKey to use
     * @returns {string} label
     */
    public getActionLabel(module: string, item: ModuleAction, languages: LanguageStrings, labelKey = ''): string {
        if (!languages || !languages.modStrings || !item || !module) {
            return '';
        }

        let key = labelKey;
        if (!key) {
            key = item.labelKey;
        }

        let label = languages.modStrings[module] && languages.modStrings[module][key];

        if (!label) {
            label = languages.appStrings && languages.appStrings[key];
        }

        if (!label && item.module) {
            label = languages.modStrings[item.module] && languages.modStrings[item.module][key];
        }

        if (!label) {
            label = languages.modStrings.administration && languages.modStrings.administration[key];
        }

        return label || '';
    }

    /**
     * Get record router link route info
     *
     * @param {string} module name
     * @param {string} id fo the record
     * @returns {string} router link
     */
    public getRecordRouterLink(module: string, id: string): string {

        return `/${module}/record/${id}`;
    }
}
