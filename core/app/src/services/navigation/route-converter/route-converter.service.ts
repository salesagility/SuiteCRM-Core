import {Injectable} from '@angular/core';
import {DefaultUrlSerializer, Params, UrlTree} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';

@Injectable({providedIn: 'root'})
export class RouteConverter {

    constructor(
        private moduleNameMapper: ModuleNameMapper,
        private actionNameMapper: ActionNameMapper
    ) {
    }

    /**
     * Public Api
     */

    /**
     * Converts legacyLink to front end
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    public toFrontEnd(legacyLink: string): string {
        const parser = new DefaultUrlSerializer();

        const replacedString = legacyLink.replace('/legacy', '');
        const parts = replacedString.split('?');

        if (parts.length < 2) {
            return '/';
        }

        const tree: UrlTree = parser.parse('/?' + parts[1]);

        const params = tree.queryParamMap;

        const module = params.get('module') || '';
        const action = params.get('action') || '';
        const record = params.get('record') || '';

        let route = this.buildRoute(module, action, record);

        route += this.buildQueryString(tree.queryParams, ['module', 'action', 'record']);

        return route;
    }

    /**
     * Build legacy link from router information
     *
     * @param {{}} params route params
     * @param {{}} queryParams route query params
     * @returns {string} legacy url
     */
    public toLegacy(params: Params, queryParams: Params): string {
        let path = './legacy/index.php';

        const queryObject = {
            ...queryParams,
        };

        if (params.module) {
            queryObject.module = this.moduleNameMapper.toLegacy(params.module);
        }
        if (params.action) {
            queryObject.action = this.actionNameMapper.toLegacy(params.action);
        }

        if (params.record) {
            queryObject.record = params.record;
        }

        path += this.buildQueryString(queryObject);

        return path;
    }

    /**
     * Internal API
     */

    /**
     * Build front end route
     *
     * @param {string} module name
     * @param {string} action name
     * @param {string} record id
     * @returns {string} route
     */
    protected buildRoute(module: string, action: string, record: string): string {
        const moduleName = this.mapModuleToFrontend(module);
        let route = `${moduleName}`;

        if (action) {
            const actionName = this.mapActionToFrontEnd(action);
            route += `/${actionName}`;
        }

        if (record) {
            route += `/${record}`;
        }

        return route;
    }

    /**
     * Build query string
     *
     * @param {{}} queryParams query parameters
     * @param {string[]} exclude paramenters to exclude
     * @returns {string} query string
     */
    protected buildQueryString(queryParams: Params, exclude: string[] = []): string {

        let params = new HttpParams();


        Object.keys(queryParams).forEach((param) => {

            if (exclude.includes(param)) {
                return;
            }

            const value = queryParams[param];
            params = params.set(param, value);
        });

        if (params.keys().length > 0) {
            return '?' + params.toString();
        }

        return '';
    }

    /**
     * Map legacy module name to frontend
     *
     * @param {string} module legacy name
     * @returns {string} frontend name
     */
    protected mapModuleToFrontend(module: string): string {
        return this.moduleNameMapper.toFrontend(module);
    }

    /**
     * Map legacy action name to frontend
     *
     * @param {string} action legacy name
     * @returns {string} frontend name
     */
    protected mapActionToFrontEnd(action: string): string {
        return this.actionNameMapper.toFrontend(action);
    }
}
